const platform = require('connect-platform');
const docker = require('./connection')

platform.core.node({
  path: '/docker/pull',
  public: false,
  method: 'GET',

  inputs: ['image'],
  outputs: ['error'],
  controlOutputs: ['done'],
  hints: {
    node: 'Pulls an image for use in connect',
    inputs: {
      image: 'Name of the image that should be pulled',
    },
    outputs: {'error': ''},
    controlOutputs: {
      done: 'Determines if the job is finished successfully.'
    }
  }
},
  function (inputs, output, control) {
    docker
      .pull(inputs.image)
      .then(() => {
        control('done')
      })
      .catch(err => {
        output('error', err.message)
      })
  }
);
