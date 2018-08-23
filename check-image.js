const platform = require('connect-platform');
const docker = require('./connection')

platform.core.node({
  path: '/docker/check-image',
  public: false,
  method: 'GET',

  inputs: ['image'],
  outputs: [],
  controlOutputs: ['exists', 'doesNotExist'],
  hints: {
    node: 'Checks if the name of the given <span class="hl-blue">image</span>. exists on Connect or not.',
    inputs: {
      image: 'Name of the image to check.',
    },
    outputs: {},
    controlOutputs: {
      exists: 'Already exists.',
      doesNotExist: 'Does not exist.'
    }
  }
},
  function (inputs, output, control) {
    docker.listImages({
      filters: {
        before: [inputs.image]
      }
    })
      .then(images => {
        if (images.length > 0) {
          control('exists')
        } else {
          control('doesNotExist')
        }
        })
      .catch(err => {
        control('doesNotExist')
       })
  }
);
