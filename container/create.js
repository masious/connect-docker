const platform = require('connect-platform');
const docker = require('../connection');

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
    'networks'
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
      networks: 'Networks to be connected to. With possibility to include config.'
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
      networks
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
      const tempVolumes = {}
      volumes.forEach(v => tempVolumes[v] = {})
      spec.Volumes = tempVolumes
    }

    if (Array.isArray(networks)) {
      spec.NetworkingConfig = {};
      spec.NetworkingConfig.EndpointsConfig = networks.reduce((o, val) => { o[val] = {}; return o; }, {});
    }

    docker.createContainer(spec)
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
