const processObjectAccordingConfig = require('../../../misc/objectProcessor')


const singleSessionUserConfig = {
  exclude: ['createdAt'],
  rules: [
    [
      ['sessions'],
      sessions => {
        const session = sessions[0]
        processObjectAccordingConfig(session, {
          exclude: ['userId', 'expirationDate']
        })

        return [
          {set: ['session', session]},
          {del: ['sessions']}
        ]
      }
    ]
  ]
}


module.exports = {
  singleSessionUserConfig
}