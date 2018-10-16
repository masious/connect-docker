const platform = require('connect-platform');
const docker = require('./connection');
const { randomString } = require('./utils')

platform.core.node({
  path: '/docker/create',
  public: false,
  method: 'GET',

  inputs: [
    'image',
    'envVars',
    'ports',
    'volumes'
  ],
  outputs: ['id'],
  controlOutputs: ['error'],
  hints: {
    node: 'Creates & starts a docker container with the given inputs',
    inputs: {
      envVars: 'Variables that should be accessible within container',
      ports: 'Ports that the container should expose',
      image: 'Docker image name',
      volumes: 'Container volumes',
    },
    outputs: {
      id: 'ID of the created container'
    },
    controlOutputs: {
      error: 'There is an error!'
    }
  }
},
  function (inputs, output, control, error) {
    const panelSecret = randomString(20)
    
    const spec = {
      Image: inputs.image,
      name: randomString(10)
    }

    const {
      ports,
      envVars,
      volumes
    } = inputs;

    if (ports) {
      const exposedPorts = {}
      ports.forEach(port => exposedPorts[`${port}/tcp`] = {})
      spec.exposedPorts = exposedPorts
    }

    if (envVars) {
      spec.env = Object.keys(envVars)
       .map(key => `${key}=${envVars[key]}`)
    }

    if (volumes) {
      const tempVolumes = {}
      volumes.forEach(v => tempVolumes[v] = {})
      spec.volumes = tempVolumes
    }

    docker.createContainer(spec)
    .then(container =>
      container.start()
    )
    .then(({ id }) => {
      output('id', spec.name)
    })
    .catch(err => {
      console.log(err)
      control('error')
    })
  }
);
