import React, { useEffect, useState } from 'react';
import './App.css';
import VideoCard from './VideoCard';
import About from './About';
import axios from 'axios';
import fuwawa from './fuwawa_128.png';
import fuwawa_bau from './fuwawa_bau_128.png';
import mococo from './mococo_128.png';
import mococo_bau from './mococo_bau_128.png'

const base_url = "https://bau.amesame.rocks";
const audioBaseURL = "https://d3beqw4zdoa6er.cloudfront.net";

const nFuwawaAudioClips = 17;
const nMococoAudioClips = 17;

const FuwawaAudioClips = [...Array(nFuwawaAudioClips)].map((_, i) => `Fuwawa_BauBau_${i + 1}.mp3`);
const MococoAudioClips = [...Array(nMococoAudioClips)].map((_, i) => `Mococo_BauBau_${i + 1}.mp3`);

const GetAudio = (source: string) => {
  let audioSrc = audioBaseURL;

  switch (source) {
    case "fuwawa":
      audioSrc += `/${FuwawaAudioClips[Math.floor(Math.random() * nFuwawaAudioClips)]}`
      break;
    case "mococo":
      audioSrc += `/${MococoAudioClips[Math.floor(Math.random() * nMococoAudioClips)]}`
      break;
    default:
      throw new Error("Unknown source");
  }

  return new Audio(audioSrc);
}


const PreloadAudio = () => {
  FuwawaAudioClips.forEach((e) => { new Audio(`${audioBaseURL}/${e}`) });
  MococoAudioClips.forEach((e) => { new Audio(`${audioBaseURL}/${e}`) });
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

    setMessage(pinnedMessage !== null ? pinnedMessage : quotes[Math.floor(Math.random() * quotes.length)]);

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

        <div>
          <p>BAU BAU NAU!! 🐾🩵🩷</p>
          <VideoCard link='https://www.youtube.com/watch?v=bUOu7BiM9eQ' thumbnail='https://i.ytimg.com/vi/bUOu7BiM9eQ/mqdefault_live.jpg' title='【WHITE ALBUM】spending white day together ❄️🐾' startTime='2024-03-15T01:00:00Z'></VideoCard>
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
