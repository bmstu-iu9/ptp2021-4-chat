const processObjectAccordingConfig = require('../../../misc/objectProcessor')


const singleSessionUserConfig = {
  exclude: ['createdAt'],
  rules: [
    [
      ['sessions'],
      sessions => {
        const session = sessions[0]
        processObjectAccordingConfig(session, {
          exclude: ['userId']
        })

        return [
          {set: ['session', session]},
          {del: ['sessions']}
        ]
      }
    ]
  ]
}

const justUserConfig = {
  exclude: ['createdAt']
}


module.exports = {
  singleSessionUserConfig,
  justUserConfig
}