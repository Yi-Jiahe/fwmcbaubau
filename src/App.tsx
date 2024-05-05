import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import Settings from './Settings';
import { SettingsContext } from './SettingsContext';

const base_url = "https://bau.amesame.rocks";
const audioBaseURL = "https://d3beqw4zdoa6er.cloudfront.net";
const youtubeChannelTrackerUrl = "https://youtube-channel-tracker.amesame.rocks";

const nFuwawaAudioClips = 17;
const nMococoAudioClips = 17;

const FuwawaAudioClips = [...Array(nFuwawaAudioClips)].map((_, i) => new Audio(`${audioBaseURL}/Fuwawa_BauBau_${i + 1}.mp3`));
const MococoAudioClips = [...Array(nMococoAudioClips)].map((_, i) => new Audio(`${audioBaseURL}/Mococo_BauBau_${i + 1}.mp3`));

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
  const [bauCount, setBauCount] = useState(0);
  const [prevBauCount, setPrevBauCount] = useState(0);

  // Animation
  const [playFuwawaBau, setPlayFuwawaBau] = useState(false);
  const [playMococoBau, setPlayMococoBau] = useState(false);

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);


  // Message
  const [message, setMessage] = useState<undefined | string>(pinnedMessage !== null ? pinnedMessage : quotes[Math.floor(Math.random() * quotes.length)]);
  const [showMessage, setShowMessage] = useState(false);

  // Streaming
  const [streams, setStreams] = useState<null | Array<Stream>>(null);

  // Play Global Baus
  // User must have interacted with the site to play audio at least once for audio to be played in the background
  const [userInteracted, setUserInteracted] = useState(false)

  // Constants
  const bauPollingIntervalMillis = 2000;
  const maxGlobalBausPlayedPerSecond = 2;

  const settings = useContext(SettingsContext);

  const GetAudio = useCallback((source: string): HTMLAudioElement => {
    let audio: HTMLAudioElement;
    switch (source) {
      case "fuwawa":
        audio = FuwawaAudioClips[Math.floor(Math.random() * nFuwawaAudioClips)].cloneNode(true) as HTMLAudioElement;
        break;
      case "mococo":
        audio = MococoAudioClips[Math.floor(Math.random() * nMococoAudioClips)].cloneNode(true) as HTMLAudioElement;
        break;
      default:
        throw new Error("Unknown source");
    }

    audio.volume = settings === null ? 1 : settings.masterVolume;

    return audio
  }, [settings]);

  const UpdateStream = () => {
    axios.get(`${youtubeChannelTrackerUrl}/api/channel/UCt9H_RpQzhxzlyBxFqrdHqA/streams`)
      .then(resp => {
        if (resp.data === '') {
          setStreams(null);
          return;
        }

        setStreams(resp.data.sort((a: Stream, b: Stream) => {
          const startTimeA = a.ActualStartTime === undefined ? a.ScheduledStartTime : a.ActualStartTime;
          const startTimeB = b.ActualStartTime === undefined ? b.ScheduledStartTime : b.ActualStartTime;

          if (startTimeA < startTimeB) { return -1; }
          if (startTimeA > startTimeB) { return 1; }
          return 0;
        }
        ));
      })
      .catch(err => { console.log(err); });
  };

  useEffect(() => {
    // Initialize bau count
    axios.get(`${base_url}/bau`)
      .then(resp => { setGlobalBauCount(resp.data['baus']); })
      .catch(err => { console.log(err); });

    UpdateStream();

    const streamPollingInterval = setInterval(() => UpdateStream(), 60000);

    return () => {
      clearInterval(streamPollingInterval);
    };
  }, []);

  const playConfetti = useCallback((currentGlobalBauCount: number) => {
    if (globalBauCount === undefined) {
      return;
    }

    // Confetti
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
  }, [globalBauCount]);

  const playGlobalBaus = useCallback((currentGlobalBauCount: number) => {
    const minGlobalBauVolume = 0.3;

    if (globalBauCount) {
      if (settings?.playGlobalBaus && bauCount && prevBauCount) {
        const dGlobalBaus = currentGlobalBauCount - globalBauCount;
        const dBaus = bauCount - prevBauCount;
        const dForeignBaus = dGlobalBaus - dBaus;

        for (let i = 0; i < dForeignBaus && i < maxGlobalBausPlayedPerSecond * (bauPollingIntervalMillis / 1000); i++) {
          let audio;
          switch (Math.floor(Math.random() * 2)) {
            case 0:
              audio = GetAudio("mococo");
              break;
            case 1:
              audio = GetAudio("fuwawa");
              break;
            default:
              audio = null;
              continue;
          }

          // Adjust the volume to the globalBausVolume * a random value between minGlobalBauVolume and 1
          audio.volume = settings.globalBausVolume * (minGlobalBauVolume + (1 - minGlobalBauVolume) * Math.random());
          setTimeout(() => audio.play(), Math.floor(Math.random() * bauPollingIntervalMillis));
        }
      }
    }
  }, [settings?.playGlobalBaus, settings?.globalBausVolume, GetAudio, bauCount, prevBauCount, globalBauCount]);

  const parseBauResponse = useCallback((resp: AxiosResponse, hooks: Array<(currentGlobalBauCount: number) => void>) => {
    const currentGlobalBauCount = resp.data['baus'];

    hooks.forEach(hook => hook(currentGlobalBauCount));

    setPrevBauCount(bauCount);
    setGlobalBauCount(currentGlobalBauCount);
  }, [bauCount]);

  const bauPoll = useCallback(() => {
    axios.get(`${base_url}/bau`)
      .then(resp => {
        parseBauResponse(resp, [
          playConfetti,
          playGlobalBaus,
        ])
      })
      .catch(err => { console.log(err); });
  }, [parseBauResponse, playConfetti, playGlobalBaus]);

  useEffect(() => {
    const interval = setInterval(bauPoll, bauPollingIntervalMillis);

    //Clearing the interval
    return () => {
      clearInterval(interval);
    };
  }, [bauPoll]);

  const PostBau = (source: string) => {
    axios.post(`${base_url}/bau?source=${source}`)
      .then(resp => {
        setBauCount(bauCount + 1);
        parseBauResponse(resp, [
          playConfetti,
        ])
      })
      .catch(err => { console.log(err); })
  };

  // In order to allow the site to play audio, the user must have interacted with the site to play audio first
  useEffect(() => {
    if (settings?.playGlobalBaus && !userInteracted) {
      setMessage("BAU BAU to tune in to global baus!");
      setShowMessage(true);
    }
  }, [settings?.playGlobalBaus, userInteracted])

  return (
    <div className="App">
      {showMessage && <div id='message' onClick={() => setShowMessage(false)}>
        <p>{message}</p>
      </div>}

      <img id='show-settings' src="./settings.svg" alt="settings" width='24px' height='24px' onClick={() => setShowSettings(true)} />

      <div id="content">
        <p id='global-bau-counter'>{globalBauCount ? globalBauCount : "-"}</p>
        <p id='global-bau-counter-label'>GLOBAL BAU COUNTER</p>
        <div
          className='button-container'>
          <div
            id='fuwawa'
            onClick={() => {
              const a = GetAudio("fuwawa");
              a.play().then(
                () => {
                  setUserInteracted(true);
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
              const a = GetAudio("mococo");
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
          <StreamStatus streams={streams} />
        </div>

        <p id='subscribe'>Subscribe to <a href='https://www.youtube.com/@FUWAMOCOch'>FUWAMOCO Ch. hololive-EN</a></p>
      </div>


      {showSettings &&
        <Settings
          closeSettings={() => setShowSettings(false)} />
      }
      {showAbout && <About closeAbout={() => setShowAbout(false)} />}

      <footer>
        <button className='footer-button' onClick={() => { setShowAbout(true); }}>About</button>
      </footer>
    </div>
  );
}

export default App;
