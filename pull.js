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
    .pull(
      inputs.image,
      function(err, stream) {
        console.log("Image pull started. Stream from CLI will follow");

        docker.modem.followProgress(stream, onFinished, onProgress);

        function onFinished(err, output) {
          console.log("Output event log:");
          console.log("---------START---------");
          console.log(output);
          console.log("----------END----------");

          if(err) {
            output('error', err);
          } else {
            control('done');
          }
        }

        function onProgress(event) {
          console.log("Progress event log:");
          console.log("---------START---------");
          console.log(event);
          console.log("----------END----------");

        }
      }
    );
  }
);
