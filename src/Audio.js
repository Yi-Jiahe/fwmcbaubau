// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();

const masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination)

const globalBauGainNode = audioContext.createGain();
globalBauGainNode.gain.value = 0.7;
globalBauGainNode.connect(masterGainNode);

function enableAudioContext() {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function setMasterGain(gain) {
  masterGainNode.gain.value = gain;
}

function setGlobalBauVolume(gain) {
  globalBauGainNode.gain.value = gain
}

function playBau(audio, onPlay) {
  const clip = audioContext.createMediaElementSource(audio);
  clip.connect(masterGainNode);
  audio.play().then(() => {
    if (onPlay !== undefined) { onPlay(); }
  });
  audio.addEventListener("ended", () => {
    clip.disconnect();
  })
}

function playGlobalBau(audio) {
  const clip = audioContext.createMediaElementSource(audio);
  clip.connect(globalBauGainNode)
  audio.play();
  audio.addEventListener("ended", () => {
    clip.disconnect();
  })
}

export {
  enableAudioContext,
  setMasterGain,
  setGlobalBauVolume,
  playBau,
  playGlobalBau,
}