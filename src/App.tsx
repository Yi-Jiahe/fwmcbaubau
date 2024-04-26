import React, { useCallback, useEffect, useState } from 'react';

import './App.css';
import About from './About';
import axios, { AxiosResponse } from 'axios';
import fuwawa from './fuwawa_128.png';
import fuwawa_bau from './fuwawa_bau_128.png';
import mococo from './mococo_128.png';
import mococo_bau from './mococo_bau_128.png'
import { Stream } from './types';
import StreamStatus from './StreamStatus';
import { milestonePower } from './utils';
import { rainFwmcHearts, shootFwmcHearts, shootSideConfetti } from './confetti';

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
  // Bau Counts
  const [globalBauCount, setGlobalBauCount] = useState<undefined | number>();

  // Animation
  const [playFuwawaBau, setPlayFuwawaBau] = useState(false);
  const [playMococoBau, setPlayMococoBau] = useState(false);

  // About
  const [showAbout, setShowAbout] = useState(false);

  // Message
  const [message, setMessage] = useState<undefined | string>();
  const [showMessage, setShowMessage] = useState(false);

  // Streaming
  const [stream, setStream] = useState<null | Stream>(null);

  // Constants
  const bauPollingIntervalMillis = 2000;

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
    // Initialize bau count
    axios.get(`${base_url}/bau`)
      .then(resp => { setGlobalBauCount(resp.data['baus']); })
      .catch(err => { console.log(err); });

    UpdateStream();

    setMessage(pinnedMessage !== null ? pinnedMessage : quotes[Math.floor(Math.random() * quotes.length)]);

    const streamPollingInterval = setInterval(() => UpdateStream(), 60000);

    //Clearing the interval
    return () => {
      clearInterval(streamPollingInterval);
    };
  }, []);

  const parseBauResponse = useCallback((resp: AxiosResponse) => {
    const currentGlobalBauCount = resp.data['baus'];

    if (globalBauCount) {
      switch (milestonePower(globalBauCount, currentGlobalBauCount)) {
        case 6:
          rainFwmcHearts(60, 1);
          shootFwmcHearts(30, 2);
          break;
        case 5:
          rainFwmcHearts(30, 1);
          shootFwmcHearts(15, 2);
          break;
        case 4:
          shootFwmcHearts(5, 2);
          break;
        case 3:
          shootSideConfetti();
          break;
      }
    }

    setGlobalBauCount(currentGlobalBauCount);
  }, [globalBauCount]);

  const bauPoll = useCallback(() => {
    axios.get(`${base_url}/bau`)
      .then(resp => parseBauResponse(resp))
      .catch(err => { console.log(err); });
  }, [parseBauResponse]);

  useEffect(() => {
    const interval = setInterval(bauPoll, bauPollingIntervalMillis);

    //Clearing the interval
    return () => {
      clearInterval(interval);
    };
  }, [bauPoll]);

  const PostBau = (source: string) => {
    axios.post(`${base_url}/bau?source=${source}`)
      .then(resp => parseBauResponse(resp))
      .catch(err => { console.log(err); })
  };

  return (
    <div className="App">
      {showMessage && <div id='message' onClick={() => setShowMessage(false)}>
        <p>{message}</p>
      </div>}
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
