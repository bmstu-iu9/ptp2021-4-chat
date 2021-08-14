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
      content: {type: 'string'},
      files: {type: 'array', items: {type: 'string'}}
    },
    required: ['conversationId', 'contentType', 'content']
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
      content: {type: 'string'}
    },
    required: ['conversationId', 'relativeId', 'content']
  },
  deleteMessage: {
    type: 'object',
    properties: {
      conversationId: {type: 'integer'},
      relativeId: {type: 'integer'}
    },
    required: ['conversationId', 'relativeId']
  }
}

const validator = new Validator()
validator.customFormats.contentTypeENUM = (input) => {
  return ['text', 'voice'].includes(input)
}

function validateSchema(payload) {
  if (!validator.validate(payload, schema)) {
    return false
  }

  const metaSchema = metaSchemas[payload.request]

  if (!metaSchema) {
    return false
  }

  return validator.validate(payload.meta, metaSchema, {required: true})
}


module.exports = {
  validateSchema,
  endpoints: {
    getAllConversations: require('./getAllConversations'),
    getConversation: require('./getConversation'),
    createMessage: require('./createMessage'),
    readMessage: require('./readMessage'),
    editMessage: require('./editMessage'),
    deleteMessage: require('./deleteMessage')
  }
}