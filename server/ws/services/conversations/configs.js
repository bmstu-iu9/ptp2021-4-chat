const fullConversationConfig = {
  exclude: ['createdAt'],
  rules: [
    [
      ['type', 'discussionMeta'],
      (type, meta) => {
        if (type === 'discussion') {
          return [
            {set: ['name', meta.name]},
            {del: ['discussionMeta']}
          ]
        }
        return {del: ['discussionMeta']}
      }
    ],
    [
      ['participants'],
      participants => {
        if (!participants) {
          return {set: ['participants', []]}
        }
      }
    ]
  ]
}

const onlyIdConversationConfig = {
  exclude: [
    'type', 'createdAt', 'generatedAt',
    'unreadCount', 'participants', 'discussionMeta'
  ]
}

const newMessageConversationConfig = {
  exclude: ['type', 'createdAt', 'participants', 'discussionMeta']
}


module.exports = {
  fullConversationConfig,
  onlyIdConversationConfig,
  newMessageConversationConfig
}