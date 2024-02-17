import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const base_url = "http://bau.amesame.rocks"

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
        <p>{globalBauCount ? globalBauCount : "-"}</p>
        <p>Global Bau Counter</p>
        <div
          className='button-container'>
          <div
            id='fuwawa'
            className={playFuwawaBau ? 'play-fuwawa-bau' : ''}
            onClick={() => {
              setPlayFuwawaBau(true)
              PostBau("fuwawa");
            }}
            onAnimationEnd={() => { setPlayFuwawaBau(false) }}
          />
          <div
            id='mococo'
            className={playMococoBau ? 'play-mococo-bau' : ''}
            onClick={() => {
              setPlayMococoBau(true)
              PostBau("mococo");
            }}
            onAnimationEnd={() => { setPlayMococoBau(false) }}
          />
        </div>
    </div>
  );
}

export default App;
