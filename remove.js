const platform = require('connect-platform');
const docker = require('./connection')

platform.core.node({
  path: '/docker/remove',
  public: false,
  method: 'GET',

  inputs: ['id'],
  outputs: [],
  controlOutputs: ['success', 'error'],
  hints: {
    node: 'Removes the given container',
    inputs: {
      image: 'ID of the container to remove',
    },
    outputs: {},
    controlOutputs: {
      success: 'Removed successfully',
      error: 'Unable to Remove'
    }
  }
},
  function (inputs, output, control) {
    docker
      .getContainer(inputs.id)
      .then(container => {
        return container.remove()
      })
      .then((err, data) => {
        if (err) {
          control('error')
          return
        }
        control('success')
      })
  }
);
