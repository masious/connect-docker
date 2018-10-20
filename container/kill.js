const platform = require('connect-platform');
const docker = require('../connection')

platform.core.node({
  path: '/docker/container/kill',
  public: false,
  method: 'GET',

  inputs: ['id'],
  outputs: [],
  controlOutputs: ['success', 'error'],
  hints: {
    node: 'Kills the given container.',
    inputs: {
      id: 'Id of the container to kill.',
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
      .kill((err, data) => {
        if (err) {
          console.log(err);
          
          control('error')
          return
        }
        control('success')
      })
  }
);
