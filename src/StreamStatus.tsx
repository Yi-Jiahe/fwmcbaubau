import { Stream } from './types.ts';
import VideoCard, { EmptyVideoCard } from './VideoCard.tsx';

type StreamStatusProps = {
  stream: Stream | null
}

function StreamStatus(props: StreamStatusProps) {
  if (props.stream === null) {
    return (
      <div>
        <p style={{marginBottom: '0'}}>Next Stream:</p>
        <EmptyVideoCard />
      </div>
    );
  }

  const startTime = props.stream.ActualStartTime === undefined ? props.stream.ScheduledStartTime : props.stream.ActualStartTime;

  return (
        <div>
          <p style={{marginBottom: '0'}}>{Date.now() >= Date.parse(startTime) ? "BAU BAU NAU!! 🐾🩵🩷" : "Next Stream:" }</p>
          <VideoCard link={`https://www.youtube.com/watch?v=${props.stream.Id}`} thumbnail={props.stream.Thumbnail} title={props.stream.Title} startTime={startTime}></VideoCard>
        </div>
  );
}

export default StreamStatus;