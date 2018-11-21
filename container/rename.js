const platform = require('connect-platform');
const docker = require('../connection')

platform.core.node({
  path: '/docker/container/rename',
  public: false,
  method: 'GET',

  inputs: ['id', 'name'],
  outputs: [],
  controlOutputs: ['success', 'error'],
  hints: {
    node: 'Rename the given container.',
    inputs: {
      id: 'Id of the container to rename.',
      name: 'New name of the container.'
    },
    outputs: {},
    controlOutputs: {
      success: 'An output flag to indicate if the container was renamed successfully.',
      error: 'An output flag to indicate if an error was triggered.'
    }
  }
},
  function (inputs, output, control) {
    docker
      .getContainer(inputs.id)
      .rename({'name': inputs.name }, (err, data) => {
        if (err) {
          console.log(err);
          
          control('error')
          return
        }
        control('success')
      })
  }
);
