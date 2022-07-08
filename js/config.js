// @flow

const config = {
  bpm: 160,

  audioFiles: [
    {path: 'audio/Beat1.m4a', type: 'm4a'},
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
