// @flow

const config = {
  bpm: 180,

  audioFiles: [
    {path: 'audio/Song Oct. 9.wav', type: 'mp3'},
  ],


};

const framesPerBeat = () => {
  return 60 /*fps*/ * 60 /*sec per min*/ / config.bpm;
}

const millisPerBeat = () => {
  return 60 /*sec per min*/ * 1000 /*millis per sec*/ / config.bpm;
}

module.exports = {
  config,
  framesPerBeat,
  millisPerBeat,
};
