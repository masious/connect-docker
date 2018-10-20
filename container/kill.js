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
    node: 'Kills the given container',
    inputs: {
      image: 'ID of the container to kill',
    },
    outputs: {},
    controlOutputs: {
      success: 'Killed successfully',
      error: 'Unable to kill'
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
