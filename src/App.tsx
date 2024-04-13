import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import About from './About';
import axios from 'axios';
import fuwawa from './fuwawa_128.png';
import fuwawa_bau from './fuwawa_bau_128.png';
import mococo from './mococo_128.png';
import mococo_bau from './mococo_bau_128.png'
import { Stream } from './types';
import StreamStatus from './StreamStatus';

const base_url = "https://bau.amesame.rocks";
const audioBaseURL = "https://d3beqw4zdoa6er.cloudfront.net";
const youtubeChannelTrackerUrl = "https://youtube-channel-tracker.amesame.rocks";

const nFuwawaAudioClips = 17;
const nMococoAudioClips = 17;

const FuwawaAudioClips = [...Array(nFuwawaAudioClips)].map((_, i) => new Audio(`${audioBaseURL}/Fuwawa_BauBau_${i + 1}.mp3`));
const MococoAudioClips = [...Array(nMococoAudioClips)].map((_, i) => new Audio(`${audioBaseURL}/Mococo_BauBau_${i + 1}.mp3`));

const GetAudio = (source: string) => {
  switch (source) {
    case "fuwawa":
      return FuwawaAudioClips[Math.floor(Math.random() * nFuwawaAudioClips)];
    case "mococo":
      return MococoAudioClips[Math.floor(Math.random() * nMococoAudioClips)];
    default:
      throw new Error("Unknown source");
  }
}

const quotes = [
  "To Bau or not to Bau",
  "To live is to Bau",
  "Bau Bau Bau Bau Bau Bau!",
  "I Bau, therefore I am",
]

const pinnedMessage = `FUWAMOCO IN JAPAN!
THEY'RE BACK!`;


function App() {
  const [globalBauCount, setGlobalBauCount] = useState<undefined | number>();
  const [bauCount, setBauCount] = useState(0);
  const [prevGlobalBauCount, setPreviousGlobalBauCount] = useState<undefined | number>();
  const [prevBauCount, setPrevBauCount] = useState(0);
  const [playFuwawaBau, setPlayFuwawaBau] = useState(false);
  const [playMococoBau, setPlayMococoBau] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [message, setMessage] = useState<undefined | string>(pinnedMessage !== null ? pinnedMessage : quotes[Math.floor(Math.random() * quotes.length)]);
  const [showMessage, setShowMessage] = useState(false);
  const [stream, setStream] = useState<null | Stream>(null);
  const [playForeignBaus, setPlayForeignBaus] = useState(false);
  // User must have interacted with the site to play audio at least once for audio to be played in the background
  const [userInteracted, setUserInteracted] = useState(false)
  const bauPollingIntervalMillis = 2000;
  const maxForeignBausPerSecond = 2;

  const bauPoll = useCallback(() => {
    axios.get(`${base_url}/bau`)
      .then(resp => {
        const currentGlobalBauCount = resp.data['baus'];

        if (globalBauCount && prevGlobalBauCount && prevBauCount) {
          // Only baus not from the user are to be played
          const dGlobalBaus = globalBauCount - prevGlobalBauCount;
          const dBaus = bauCount - prevBauCount;
          const dForeignBaus = dGlobalBaus - dBaus;

          if (playForeignBaus) {
            for (let i = 0; i < dForeignBaus && i < maxForeignBausPerSecond * (bauPollingIntervalMillis / 1000); i++) {
              console.log(i);
              let audio: null | Node;

              // Clone node so that volume changes doesn't affect the original
              switch (Math.floor(Math.random() * 2)) {
                case 0:
                  audio = GetAudio("mococo").cloneNode(true);
                  break;
                case 1:
                  audio = GetAudio("fuwawa").cloneNode(true);
                  break;
                default:
                  audio = null;
              }

              if (audio === null) { continue; }

              // Adjust the volume between min and max
              // ts-ignore because cloned node type is missing audio methods and properties
              // @ts-ignore
              audio.volume = 0.3 + 0.4 * Math.random();
              // @ts-ignore
              setTimeout(() => audio.play(), Math.floor(Math.random() * bauPollingIntervalMillis));
            }
          }

        }

        setPrevBauCount(bauCount);
        setPreviousGlobalBauCount(globalBauCount);
        setGlobalBauCount(currentGlobalBauCount);
      })
      .catch(err => { console.log(err); });
  }, [bauCount, globalBauCount, prevBauCount, prevGlobalBauCount, playForeignBaus]);

  const UpdateBauCount = () => {
    axios.get(`${base_url}/bau`)
      .then(resp => { setGlobalBauCount(resp.data['baus']); })
      .catch(err => { console.log(err); });
  };

  const UpdateStream = () => {
    axios.get(`${youtubeChannelTrackerUrl}/api/channel/UCt9H_RpQzhxzlyBxFqrdHqA/stream`)
      .then(resp => {
        if (resp.data === '') {
          setStream(null);
          return;
        }
        setStream(resp.data);
      })
      .catch(err => { console.log(err); });
  };

  useEffect(() => {
    UpdateBauCount();
    UpdateStream();

    setMessage(pinnedMessage !== null ? pinnedMessage : quotes[Math.floor(Math.random() * quotes.length)]);

    const streamPollingInterval = setInterval(() => UpdateStream(), 60000);
    const interval = setInterval(bauPoll, bauPollingIntervalMillis);

    //Clearing the interval
    return () => {
      clearInterval(interval);
      clearInterval(streamPollingInterval);
    };
  }, [bauPoll])

  const PostBau = (source: string) => {
    axios.post(`${base_url}/bau?source=${source}`)
      .then(resp => {
        // Increment the local bau count here because it would be strange if the local bau count increased faster than the global bau count
        setBauCount(bauCount + 1);
        setGlobalBauCount(resp.data['baus']);
      })
      .catch(err => { console.log(err); })
  };

  return (
    <div className="App">
      {showMessage && <div id='message' onClick={() => setShowMessage(false)}>
        <p>{message}</p>
      </div>}

      <input id='play-foreign-baus-checkbox' type='checkbox' checked={playForeignBaus} onChange={() => {
        // In order to allow the site to play audio, the user must have interacted with the site to play audio first
        if (!playForeignBaus && !userInteracted) {
          setMessage("BAU BAU to confirm opting in to foreign baus!");
          setShowMessage(true);
        }
        setPlayForeignBaus(!playForeignBaus)
      }} />
      <label htmlFor='play-foreign-baus-checkbox'>Play Foreign Baus</label>

      <div id="content">
        <p id='global-bau-counter'>{globalBauCount ? globalBauCount : "-"}</p>
        <p id='global-bau-counter-label'>GLOBAL BAU COUNTER</p>
        <div
          className='button-container'>
          <div
            id='fuwawa'
            onClick={() => {
              let a = GetAudio("fuwawa");
              a.play().then(
                () => {
                  if (!playFuwawaBau) {
                    setUserInteracted(true);
                    setPlayFuwawaBau(true);
                    setTimeout(() => { setPlayFuwawaBau(false) }, 1200);
                  }
                  PostBau("fuwawa");
                }
              );
            }}
          >
            <img id='fuwawa-bau' src={fuwawa_bau} alt='fuwawa-bau'
              className={`animated-image ${playFuwawaBau ? 'play-bau-bau' : ''}`}
            />
            <img id='fuwawa-default' src={fuwawa} alt='fuwawa'
              className={`animated-image front ${playFuwawaBau ? 'play-bau-bau' : ''}`} />
          </div>
          <div
            id='mococo'
            onClick={() => {
              let a = GetAudio("mococo");
              a.play()
                .then(() => {
                  setUserInteracted(true);
                  if (!playMococoBau) {
                    setPlayMococoBau(true);
                    setTimeout(() => { setPlayMococoBau(false) }, 1200);
                  }
                  PostBau("mococo");
                });
            }}
          >
            <img id='mococo-bau'
              src={mococo_bau} alt='fuwawa-bau' className={`animated-image ${playMococoBau ? 'play-bau-bau' : ''}`}
            />
            <img id='mococo-default' src={mococo} alt='fuwawa'
              className={`animated-image front ${playMococoBau ? 'play-bau-bau' : ''}`} />
          </div>
        </div>
        <p>Bau Count: {bauCount}</p>

        <div id='stream-status'>
          <StreamStatus stream={stream} />
        </div>

        <p id='subscribe'>Subscribe to <a href='https://www.youtube.com/@FUWAMOCOch'>FUWAMOCO Ch. hololive-EN</a></p>
      </div>



      {showAbout && <About closeAbout={() => setShowAbout(false)} />}

      <footer>
        <button className='footer-button' onClick={() => { console.log("about clicked"); setShowAbout(true); }}>About</button>
      </footer>
    </div>
  );
}

export default App;
