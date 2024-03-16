import './VideoCard.css';

type VideoCardProps = {
  link: string
  thumbnail: string
  title: string
  startTime: string
}

const millisInADay = 86400000;
const millisInAnHour = 3600000;
const millisInAMinute = 60000;

function VideoCard(props: VideoCardProps) {
  let timeDifference = Date.now() - Date.parse(props.startTime);
  const started = timeDifference > 0 ? true : false;
  if (!started) {
    timeDifference *= -1;
  }

  return (
    <a className='video-card-link' href={props.link} target='_blank' rel='noreferrer'>
          <div className='video-card'>
      <div className='thumbnail-container'>
        <img className="thumbnail" src={props.thumbnail} alt='thumbnail' />
      </div>
      <div className='card-details'>
        <p className='title'>{props.title}</p>
        <p className='time'>{started ? 'Started' : 'Starting in'} {durationString(timeDifference)} {started ? 'ago' : ''}</p>
      </div>
    </div>
    </a>
  );
}

function EmptyVideoCard() {
  return (
    <div className='video-card' style={{justifyContent: 'center', alignItems: 'center'}}>
      No stream found
  </div>
  )
}

function durationString(durationMillis: number): string {
  const daysToStart = Math.floor(durationMillis / millisInADay);
  if (daysToStart > 0) {
    return `${daysToStart} day${daysToStart === 1 ? '' : 's'}`;
  }
  const hoursToStart = Math.floor(durationMillis / millisInAnHour);
  if (hoursToStart > 0) {
    return `${hoursToStart} hour${hoursToStart === 1 ? '' : 's'}`;
  }
  const minutesToStart = Math.floor(durationMillis / millisInAMinute);
  if (minutesToStart > 0) {
    return `${minutesToStart} minute${minutesToStart === 1 ? '' : 's'}`;
  }
  const secondsToStart = Math.floor(durationMillis / 1000);
  return `${secondsToStart} second${secondsToStart === 1 ? '' : 's'}`;
}

export default VideoCard
export { EmptyVideoCard };