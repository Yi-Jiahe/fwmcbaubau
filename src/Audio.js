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
  audio.addEventListener("ended", () => {
    clip.disconnect();
  });
  audio.play().then(() => {
    if (onPlay !== undefined) { onPlay(); }
  });

}

function playGlobalBau(audio) {
  const clip = audioContext.createMediaElementSource(audio);
  clip.connect(globalBauGainNode);
  audio.addEventListener("ended", () => {
    clip.disconnect();
  });
  audio.play();

}

export {
  enableAudioContext,
  setMasterGain,
  setGlobalBauVolume,
  playBau,
  playGlobalBau,
}