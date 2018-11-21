const platform = require('connect-platform');
const docker = require('../connection')

platform.core.node({
  path: '/docker/container/remove',
  public: false,
  method: 'GET',

  inputs: ['id'],
  outputs: [],
  controlOutputs: ['success', 'error'],
  hints: {
    node: 'Remove the given container.',
    inputs: {
      id: 'Id of the container to remove.',
    },
    outputs: {},
    controlOutputs: {
      success: 'An output flag to indicate if the container was removed successfully.',
      error: 'An output flag to indicate if an error was triggered.'
    }
  }
},
  function (inputs, output, control) {
    docker
      .getContainer(inputs.id)
      .remove((err, data) => {
        if (err) {
          console.log(err);
          
          control('error')
          return
        }
        control('success')
      })
  }
);
