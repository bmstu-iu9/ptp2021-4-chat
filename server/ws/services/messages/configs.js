const fullMessageConfig = {
  exclude: [
    'id', 'content.id', 'user.createdAt',
    'deleted', 'editedAt', 'deletedAt',
    'conversationId', 'userId', 'contentId'
  ],
  rules: [
    [
      ['content.type', 'content.files'],
      (type, files) => {
        if (type === 'text' && !files) {
          return {set: ['content.files', []]}
        }
      }
    ],
    [
      ['server'],
      server => {
        if (server) {
          return {del: ['self', 'read', 'user', 'edited']}
        }
      }
    ]
  ]
}

const newMessageConfig = {
  exclude: fullMessageConfig.exclude.concat('edited'),
  rules: fullMessageConfig.rules
}

const editedMessageStateConfig = {
  exclude: [
    'id', 'deleted', 'edited',
    'editedAt', 'deletedAt', 'createdAt',
    'conversationId', 'userId', 'contentId',
    'self', 'read', 'user', 'server',
    'content.id', 'content.type', 'content.files'
  ],
  rules: [
    [
      [],
      () => {
        return {set: ['edited', true]}
      }
    ]
  ]
}

const deletedMessageStateConfig = {
  exclude: editedMessageStateConfig.exclude.concat('content'),
  rules: [
    [
      [],
      () => {
        return {set: ['deleted', true]}
      }
    ]
  ]
}

const readMessageStateConfig = {
  exclude: editedMessageStateConfig.exclude.concat('content'),
  rules: [
    [
      [],
      () => {
        return {set: ['read', true]}
      }
    ]
  ]
}

const createMessageConfig = {
  exclude: [
    'id', 'content.id', 'users.createdAt',
    'deleted', 'editedAt', 'deletedAt',
    'conversationId', 'userId', 'contentId',
    'self', 'read', 'user', 'edited', 'server'
  ],
  rules: [
    [
      ['content.type', 'content.files'],
      (type, files) => {
        if (type === 'text' && !files) {
          return {set: ['content.files', []]}
        }
      }
    ]
  ]
}

const editMessageConfig = {
  exclude: [
    'id', 'deleted',
    'editedAt', 'deletedAt', 'createdAt',
    'conversationId', 'userId', 'contentId',
    'self', 'read', 'user', 'server',
    'content.id', 'content.type', 'content.files'
  ]
}


module.exports = {
  fullMessageConfig,
  createMessageConfig,
  editMessageConfig,
  newMessageConfig,
  editedMessageStateConfig,
  deletedMessageStateConfig,
  readMessageStateConfig
}