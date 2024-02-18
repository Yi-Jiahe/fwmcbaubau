import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const base_url = "https://bau.amesame.rocks"
const audioBaseURL = "https://d3beqw4zdoa6er.cloudfront.net/";


const GetAudio = (source: string) => {
  const nFuwawaAudioClips = 17;
  const nMococoAudioClips = 17;

  let audioSrc = audioBaseURL;

  switch (source) {
    case "fuwawa":
      audioSrc += `Fuwawa_BauBau_${Math.floor(Math.random() * nFuwawaAudioClips) + 1}.wav`;
      break;
    case "mococo":
      audioSrc += `Mococo_BauBau_${Math.floor(Math.random() * nMococoAudioClips) + 1}.wav`;
      break;
    default:
      throw new Error("Unknown source");
  }

  return new Audio(audioSrc);
}


function App() {
  const [globalBauCount, setGlobalBauCount] = useState("-");
  const [playFuwawaBau, setPlayFuwawaBau] = useState(false);
  const [playMococoBau, setPlayMococoBau] = useState(false);

  useEffect(() => {
    axios.get(`${base_url}/bau`)
      .then(resp => { setGlobalBauCount(resp.data['baus']); })
      .catch(err => { console.log(err); })
  }, [])

  const PostBau = (source: string) => {
    axios.post(`${base_url}/bau?source=${source}`)
      .then(resp => { setGlobalBauCount(resp.data['baus']); })
      .catch(err => { console.log(err); })
  };

  return (
    <div className="App">
      <p id='global-bau-counter'>{globalBauCount ? globalBauCount : "-"}</p>
      <p id='global-bau-counter-label'>GLOBAL BAU COUNTER</p>
      <div
        className='button-container'>
        <div
          id='fuwawa'
          className={playFuwawaBau ? 'play-fuwawa-bau' : ''}
          onClick={() => {
            let a = GetAudio("fuwawa");
            a.play().then(
              () => {
                setPlayFuwawaBau(true);
                PostBau("fuwawa");
              }
            );

          }}
          onAnimationEnd={() => { setPlayFuwawaBau(false) }}
        />
        <div
          id='mococo'
          className={playMococoBau ? 'play-mococo-bau' : ''}
          onClick={() => {
            let a = GetAudio("mococo");
            a.play()
              .then(() => {
                setPlayMococoBau(true);
                PostBau("mococo");
              });

          }}
          onAnimationEnd={() => { setPlayMococoBau(false) }}
        />
      </div>
      
      <p id='subscribe'>Subscribe to <a href='https://www.youtube.com/@FUWAMOCOch'>FUWAMOCO Ch. hololive-EN</a></p>
    </div>
  );
}

export default App;
