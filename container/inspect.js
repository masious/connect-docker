const platform = require('connect-platform');
const docker = require('../connection')

platform.core.node({
  path: '/docker/container/inspect',
  public: false,
  method: 'GET',

  inputs: ['id'],
  outputs: ['container'],
  controlOutputs: ['error'],
  hints: {
    node: 'Fetches the container data and return the container object.',
    inputs: {
      id: 'The id of the container to be fetched.',
    },
    outputs: {'error': ''},
    controlOutputs: {
      error: 'Trigers if an error happens.'
    }
  }
},
  function (inputs, output, control) {
    docker
    .getContainer(inputs.id)
    .inspect(
      function(err, data) {
        console.log("Trying to fetch container by id " + inputs.id);
        if(err) {
          control('error');

          console.error(data);
        } else {
          output('container', data);
        }
      }
    );
  }
);
