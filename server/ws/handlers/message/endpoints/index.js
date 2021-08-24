const {Validator} = require('jsonschema')


const schema = {
  id: 'Schema',
  type: 'object',
  properties: {
    request: {type: 'string'},
    meta: {type: 'object'}
  },
  required: ['request']
}

const metaSchemas = {
  getUser: {
    type: 'object',
    properties: {}
  },
  getAllConversations: {
    type: 'object',
    properties: {}
  },
  getConversation: {
    type: 'object',
    properties: {
      conversationId: {type: 'integer'},
      relativeId: {type: 'integer'}
    },
    required: ['conversationId']
  },
  createMessage: {
    type: 'object',
    properties: {
      conversationId: {type: 'integer'},
      contentType: {type: 'string', format: 'contentTypeENUM'},
      value: {type: 'string'},
      files: {type: 'array', items: {type: 'string'}}
    },
    required: ['conversationId', 'contentType', 'value']
  },
  readMessage: {
    type: 'object',
    properties: {
      conversationId: {type: 'integer'},
      relativeId: {type: 'integer'}
    },
    required: ['conversationId', 'relativeId']
  },
  editMessage: {
    type: 'object',
    properties: {
      conversationId: {type: 'integer'},
      relativeId: {type: 'integer'},
      value: {type: 'string'}
    },
    required: ['conversationId', 'relativeId', 'value']
  },
  deleteMessage: {
    type: 'object',
    properties: {
      conversationId: {type: 'integer'},
      relativeId: {type: 'integer'}
    },
    required: ['conversationId', 'relativeId']
  },
  createDialog: {
    type: 'object',
    properties: {
      userId: {type: 'integer'}
    },
    required: ['userId']
  },
  createDiscussion: {
    type: 'object',
    properties: {
      name: {type: 'string'},
      userIds: {
        type: 'array',
        items: {
          type: 'integer'
        }
      }
    },
    required: ['name', 'userIds']
  }
}

const validator = new Validator()
validator.customFormats.contentTypeENUM = (input) => {
  return ['text', 'voice'].includes(input)
}

function validateSchema(payload) {
  if (!payload || !validator.validate(payload, schema)) {
    return false
  }

  const metaSchema = metaSchemas[payload.request]

  if (!payload.meta || !metaSchema) {
    return false
  }

  return validator.validate(payload.meta, metaSchema)
}


module.exports = {
  validateSchema,
  endpoints: {
    getUser: require('./getUser'),
    getAllConversations: require('./getAllConversations'),
    getConversation: require('./getConversation'),
    createMessage: require('./createMessage'),
    readMessage: require('./readMessage'),
    editMessage: require('./editMessage'),
    deleteMessage: require('./deleteMessage'),
    createDialog: require('./createDialog'),
    createDiscussion: require('./createDiscussion')
  }
}