const platform = require('connect-platform');
const docker = require('./connection');
const { randomString } = require('./utils')

platform.core.node({
  path: '/docker/create',
  public: false,
  method: 'GET',

  inputs: ['image', 'envVars', 'ports', 'volumes', 'labels'],
  outputs: ['id'],
  controlOutputs: ['error'],
  hints: {
    node: 'Creates & starts a docker container with the given inputs',
    inputs: {
      envVars: 'Variables that should be accessible within container',
      ports: 'Ports that the container should expose',
      image: 'Docker image name',
      labels: 'Object of labels',
      volumes: 'Container volumes'
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
    const exposedPorts = {}
    inputs.ports.forEach(port => exposedPorts[`${port}/tcp`] = {})

    const env = Object.keys(inputs.envVars)
      .map(key => `${key}=${inputs.envVars[key]}`)

    const volumes = {}
    inputs.volumes.forEach(v => volumes[v] = {})

    docker.createContainer({
      Image: inputs.image,
      name: randomString(10),
      env,
      volumes,
      exposedPorts,
      labels: inputs.labels,
    })
    .then(container =>
      container.start()
    )
    .then(({ id }) => {
      output('id', id)
    })
    .catch(err => {
      control('error')
    })
  }
);
