import { useState } from 'react';
import './StreamStatus.css';
import { Stream } from './types.ts';
import VideoCard, { EmptyVideoCard } from './VideoCard.tsx';

type StreamStatusProps = {
  streams: Array<Stream> | null
}

function StreamStatus(props: StreamStatusProps) {
  const [streamIndex, setStreamIndex] = useState(0);

  if (props.streams === null) {
    return (
      <div>
        <p style={{ marginBottom: '0' }}>Next Stream:</p>
        <EmptyVideoCard />
      </div>
    );
  }


  const stream = props.streams[streamIndex];

  const startTime = stream.ActualStartTime === undefined ? stream.ScheduledStartTime : stream.ActualStartTime;

  return (
    <div className='stream-status'>
      <p style={{ marginBottom: '0' }}>{Date.now() >= Date.parse(startTime) ? "BAU BAU NAU!! 🐾🩵🩷" : "Next Stream:"}</p>
      <div className='card-carousel'>
        <button id='card-carousel-back-button' onClick={() => setStreamIndex(streamIndex - 1)} disabled={streamIndex <= 0}>◀ </button>
        <VideoCard link={`https://www.youtube.com/watch?v=${stream.Id}`} thumbnail={stream.Thumbnail} title={stream.Title} startTime={startTime}></VideoCard>
        <button id='card-carousel-forward-button' onClick={() => setStreamIndex(streamIndex + 1)} disabled={streamIndex >= props.streams.length - 1}>▶</button>
      </div>
    </div>
  );
}

export default StreamStatus;