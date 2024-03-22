import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import fuwawa from './fuwawa_128.png';
import fuwawa_bau from './fuwawa_bau_128.png';
import mococo from './mococo_128.png';
import mococo_bau from './mococo_bau_128.png'

const base_url = "https://bau.amesame.rocks";
const audioBaseURL = "https://d3beqw4zdoa6er.cloudfront.net";

const nFuwawaAudioClips = 17;
const nMococoAudioClips = 17;

const FuwawaAudioClips = [...Array(nFuwawaAudioClips)].map((_, i) => new Audio(`${audioBaseURL}/Fuwawa_BauBau_${i+1}.mp3`));
const MococoAudioClips = [...Array(nMococoAudioClips)].map((_, i) => new Audio(`${audioBaseURL}/Mococo_BauBau_${i+1}.mp3`));

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
  const [message, setMessage] = useState<undefined | string>();
  const [showMessage, setShowMessage] = useState(false);
  const bauPollingIntervalMillis = 5000;

  const bauPoll = useCallback(() => {
    axios.get(`${base_url}/bau`)
      .then(resp => { 
        const currentGlobalBauCount = resp.data['baus'];

        if (globalBauCount && prevGlobalBauCount && prevBauCount) {
          // Only baus not from the user are to be played
          const dGlobalBaus = globalBauCount - prevGlobalBauCount;
          const dBaus = bauCount - prevBauCount;
          const dForeignBaus = dGlobalBaus - dBaus;

          for (let i = 0; i < dForeignBaus; i++) {
            switch (Math.floor(Math.random() * 2)) {
              case 0:
                setTimeout(() => GetAudio("mococo").play(), Math.floor(Math.random() * bauPollingIntervalMillis));
                break;
              case 1: 
                setTimeout(() => GetAudio("fuwawa").play(), Math.floor(Math.random() * bauPollingIntervalMillis));
            }
          }
        }

        setPrevBauCount(bauCount);
        setPreviousGlobalBauCount(globalBauCount);
        setGlobalBauCount(currentGlobalBauCount); 
      })
      .catch(err => { console.log(err); });
  }, [bauCount, globalBauCount, prevBauCount, prevGlobalBauCount]);

  useEffect(() => {
    axios.get(`${base_url}/bau`)
      .then(resp => { setGlobalBauCount(resp.data['baus']); })
      .catch(err => { console.log(err); });

    setMessage(pinnedMessage !== null ? pinnedMessage : quotes[Math.floor(Math.random() * quotes.length)]);

    const interval = setInterval(bauPoll, bauPollingIntervalMillis);

    //Clearing the interval
    return () => clearInterval(interval);
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
      {showMessage && <div id='message' onClick={() => setShowMessage(false) }>
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
        <p>Bau Count: {bauCount}</p>
        <p id='subscribe'>Subscribe to <a href='https://www.youtube.com/@FUWAMOCOch'>FUWAMOCO Ch. hololive-EN</a></p>
      </div>

      {showAbout && <About closeAbout={() => setShowAbout(false)} />}

      <footer>
        <button className='footer-button' onClick={() => { console.log("about clicked"); setShowAbout(true); }}>About</button>
      </footer>
    </div>
  );
}

type AboutProps = {
  closeAbout: () => void
}

function About({ closeAbout }: AboutProps) {
  return (
    <div className='modal'>
      <div className="modal-content">
        <span className="close" onClick={() => closeAbout()}>&times;</span>
        <p>Hello fellow Ruffian and welcome to fwmcbaubau.com!</p>

        <p>To begin with, I would like to thank you for stopping by. It means a lot to me to be able contribute to the community.</p>

        <p>I would also like to credit <a href='https://faunaraara.com/' target="_blank" rel="noreferrer">faunaraara.com</a> for giving me the inspiration to create this site.</p>

        <p>If you have any suggestions or would like to report an issue, feel free to contact me on <a href='https://twitter.com/Activepaste1' target="_blank" rel="noreferrer">Twitter</a> or <a href='https://discordapp.com/users/196269893698453504' target="_blank" rel="noreferrer">Discord</a>.</p>

        <p>fwmcbaubau.com a site built by a Ruffian for Ruffians. The use of robots for the express purpose of inflating the count is not encouraged. Measures have been taken to reduce the impact of bots, but the priority is not to impact actual Ruffians' experiences.</p>

        <p>Have fun! BAU BAU 🐾</p>
      </div>
    </div>);
}

export default App;
