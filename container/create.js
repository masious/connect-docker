const platform = require('connect-platform');
const docker = require('../connection');
const deepmerge = require('deepmerge');

platform.core.node({
  path: '/docker/container/create',
  public: false,
  method: 'GET',

  inputs: [
    'name',
    'image',
    'envVars',
    'ports',
    'volumes',
    'networks',
    'user',
    'options'
  ],
  outputs: ['id'],
  controlOutputs: ['error'],
  hints: {
    node: 'Creates & starts a docker container with the given inputs.',
    inputs: {
      name: 'Name of container. If empty then a random name is assigned by docker',
      image: 'Docker image name.',
      envVars: 'Variables that should be accessible within container.',
      ports: 'Ports that the container should expose.',
      volumes: 'Container volumes.',
      networks: 'Networks to be connected to. With possibility to include config.',
      user: 'User to be associated with container.',
      options: 'Additional optional parameters.'
    },
    outputs: {
      id: 'Id of the created container.'
    },
    controlOutputs: {
      error: 'There is an error!'
    }
  }
},
  function (inputs, output, control) {    
    const spec = {
      Image: inputs.image
    }

    const {
      name,
      ports,
      envVars,
      volumes,
      networks,
      user,
      options
    } = inputs;

    spec.name = name;

    if (ports) {
      const exposedPorts = {}
      ports.forEach(port => exposedPorts[`${port}/tcp`] = {})
      spec.ExposedPorts = exposedPorts
    }

    if (envVars) {
      spec.Env = Object.keys(envVars)
       .map(key => `${key}=${envVars[key]}`)
    }

    if (volumes) {
      var tempVolumes = {};
      var tempBinds = [];
      volumes.forEach(function(volume) {
        var destination = volume;

        if(volume.indexOf(':') > -1) {
          destination = volume.split(':')[1];
          tempBinds.push(volume);
        }
        
        tempVolumes[destination] = {};
      });

      spec.Volumes = tempVolumes;
      spec.HostConfig = {
        Binds: tempBinds
      };
    }

    if (user != "") {
      spec.User = user;
    }

    if (Array.isArray(networks)) {
      spec.NetworkingConfig = {};
      spec.NetworkingConfig.EndpointsConfig = networks.reduce((o, val) => { o[val] = {}; return o; }, {});
    }

    const finalSpec = deepmerge(spec, options);
    console.log(finalSpec);
    docker.createContainer(finalSpec)
    .then(container =>
      container.start()
    )
    .then((container) => {
      output('id', container.id)
    })
    .catch(err => {
      console.log(err)
      control('error')
    })
  }
);
