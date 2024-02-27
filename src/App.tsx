import React, { useEffect, useState } from 'react';
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

const GetAudio = (source: string) => {
  let audioSrc = audioBaseURL;

  switch (source) {
    case "fuwawa":
      audioSrc += `/Fuwawa_BauBau_${Math.floor(Math.random() * nFuwawaAudioClips) + 1}.wav`;
      break;
    case "mococo":
      audioSrc += `/Mococo_BauBau_${Math.floor(Math.random() * nMococoAudioClips) + 1}.wav`;
      break;
    default:
      throw new Error("Unknown source");
  }

  return new Audio(audioSrc);
}


const PreloadAudio = () => {
  for (let i = 1; i <= nFuwawaAudioClips; i++) {
    new Audio(`${audioBaseURL}/Fuwawa_BauBau_${i}.wav`);
  }
  for (let i = 1; i <= nFuwawaAudioClips; i++) {
    new Audio(`${audioBaseURL}/Mococo_BauBau_${i}.wav`);
  }
}

const quotes = [
  "To Bau or not to Bau",
  "To live is to Bau",
  "Bau Bau Bau Bau Bau Bau!",
  "I Bau, therefore I am",
]

function App() {
  const [globalBauCount, setGlobalBauCount] = useState("-");
  const [playFuwawaBau, setPlayFuwawaBau] = useState(false);
  const [playMococoBau, setPlayMococoBau] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [message, setMessage] = useState<undefined | string>();
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    axios.get(`${base_url}/bau`)
      .then(resp => { setGlobalBauCount(resp.data['baus']); })
      .catch(err => { console.log(err); });

    setMessage(quotes[Math.floor(Math.random() * quotes.length)]);

    PreloadAudio();

    const interval = setInterval(() => {
      axios.get(`${base_url}/bau`)
        .then(resp => { setGlobalBauCount(resp.data['baus']); })
        .catch(err => { console.log(err); });
    }, 5000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [])

  const PostBau = (source: string) => {
    axios.post(`${base_url}/bau?source=${source}`)
      .then(resp => { setGlobalBauCount(resp.data['baus']); })
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
                  setPlayFuwawaBau(true);
                  PostBau("fuwawa");
                }
              );
            }}
          >
            <img id='fuwawa-bau' src={fuwawa_bau} alt='fuwawa-bau'
              className={`animated-image ${playFuwawaBau ? 'play-bau-bau' : ''}`}
              onAnimationEnd={() => { setPlayFuwawaBau(false) }} />
            <img id='fuwawa-default' src={fuwawa} alt='fuwawa'
              className={`animated-image front ${playFuwawaBau ? 'play-bau-bau' : ''}`} />
          </div>
          <div
            id='mococo'
            onClick={() => {
              let a = GetAudio("mococo");
              a.play()
                .then(() => {
                  setPlayMococoBau(true);
                  PostBau("mococo");
                });
            }}
          >
            <img id='mococo-bau'
              src={mococo_bau} alt='fuwawa-bau' className={`animated-image ${playMococoBau ? 'play-bau-bau' : ''}`}
              onAnimationEnd={() => { setPlayMococoBau(false) }} />
            <img id='mococo-default' src={mococo} alt='fuwawa'
              className={`animated-image front ${playMococoBau ? 'play-bau-bau' : ''}`} />
          </div>
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

        <p>fwmcbaubau.com a site built by a Ruffian for Ruffians. The use of robots for the express purpose of inflating the count is not encouraged. To this end, there is an undisclosed rate limit imposed on the bau counter.</p>

        <p>Have fun! BAU BAU 🐾</p>
      </div>
    </div>);
}

export default App;
