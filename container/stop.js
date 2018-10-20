const platform = require('connect-platform');
const docker = require('../connection')

platform.core.node({
  path: '/docker/container/stop',
  public: false,
  method: 'GET',

  inputs: ['id'],
  outputs: [],
  controlOutputs: ['success', 'error'],
  hints: {
    node: 'Stops the given container.',
    inputs: {
      image: 'Id of the container to stop.',
    },
    outputs: {},
    controlOutputs: {
      success: 'An output flag to indicate if the container was killed successfully.',
      error: 'An output flag to indicate if an error was triggered.'
    }
  }
},
  function (inputs, output, control) {
    docker
      .getContainer(inputs.id)
      .stop((err, data) => {
        if (err) {
          console.log(err);
          
          control('error')
          return
        }
        control('success')
      })
  }
);
