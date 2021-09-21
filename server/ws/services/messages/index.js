const processObjectAccordingConfig = require('../../../misc/objectProcessor')
const {WSRequestError} = require('../../../misc/wsErrors')
const {ReadMessage} = require('../../../database/models/message')
const {Op} = require('sequelize')
const {messagesCountPerRequest} = require('../../../constants')
const {Content} = require('../../../database/models/content')
const {User} = require('../../../database/models/user')
const {Sequelize} = require('sequelize')
const {Message} = require('../../../database/models/message')


function getIncludesForMessage(user) {
  return [
    [Sequelize.literal('CURRENT_TIMESTAMP'), 'generatedAt'],
    [Sequelize.literal(`("userId"=${user.id})`), 'self'],
    [
      Sequelize.literal(`
      (SELECT COUNT(*) > 0 FROM "${ReadMessage.tableName}" 
       WHERE 
         "messageId"="message"."id" 
           AND 
         CASE WHEN "${Message.name}"."userId"=${user.id} 
         THEN 
           "userId" != ${user.id} 
         ELSE 
           "userId" = ${user.id} 
         END
      )`),
      'read'
    ]
  ]
}

async function editMessage(conversationId, relativeId, value) {
  const message = await Message.findOne({
    where: {
      conversationId,
      relativeId
    },
    include: [Content]
  })

  message.edited = true
  message.editedAt = new Date().toISOString()
  message.content.value = value
  await message.content.save()
  await message.save()
}

async function saveMessage(conversationId, contentType, value, files, user) {
  const content = await Content.create({
    type: contentType,
    value,
    files
  })

  const lastRelativeId = await getLastMessageRelativeId(conversationId)
  const relativeId = lastRelativeId + 1

  await Message.create({
    conversationId,
    relativeId,
    contentId: content.id,
    userId: user.id
  })

  return relativeId
}

async function deleteMessage(conversationId, relativeId) {
  const message = await Message.findOne({
    where: {
      conversationId,
      relativeId
    }
  })

  message.deleted = true
  message.deletedAt = new Date().toISOString()
  await message.save()
}

async function readMessage(conversationId, relativeId, user) {
  const messageEntry = await fetchMessage(conversationId, relativeId, user)

  await ReadMessage.create({
    messageId: messageEntry.id,
    userId: user.id
  })
}

async function fetchMessages(conversationId, user, maxRelativeId) {
  const whereOption = {
    conversationId,
    deleted: false
  }

  if (Number.isInteger(maxRelativeId)) {
    whereOption.relativeId = {[Op.lt]: maxRelativeId}
  }

  return (await Message.findAll({
    attributes: {
      include: getIncludesForMessage(user)
    },
    where: whereOption,
    include: [User, Content],
    order: [['relativeId', 'DESC']],
    limit: messagesCountPerRequest
  })).map(messageEntry => messageEntry.toJSON())
}

async function fetchMessage(conversationId, relativeId, user) {
  const fetchedMessage = await Message.findOne({
    where: {
      conversationId,
      relativeId
    },
    attributes: {
      include: getIncludesForMessage(user)
    },
    include: [User, Content]
  })

  return fetchedMessage ? fetchedMessage.toJSON() : null
}

async function fetchDeletedMessage(conversationId, relativeId, user) {
  const message = await fetchMessage(conversationId, relativeId, user)

  if (!message) {
    return null
  }

  return message.deleted ? message : null
}

async function fetchMessageOwnedByUser(conversationId, relativeId, user) {
  const message = await fetchMessage(conversationId, relativeId, user)

  if (!message) {
    return null
  }

  return message.user.id === user.id ? message : null
}

async function getMessages(conversationId, user, config = null, maxRelativeId = null) {
  const messages = await fetchMessages(conversationId, user, maxRelativeId)

  if (config) {
    messages.forEach(message => {
      processObjectAccordingConfig(message, config)
    })
  }

  return messages
}

async function getMessage(conversationId, relativeId, user, config = null) {
  const message = await fetchMessage(conversationId, relativeId, user)

  if (message && config) {
    processObjectAccordingConfig(message, config)
  }

  return message
}

async function getDeletedMessage(conversationId, relativeId, user, config = null) {
  const message = await fetchDeletedMessage(conversationId, relativeId, user)

  if (message && config) {
    processObjectAccordingConfig(message, config)
  }

  return message
}

async function getLastMessageRelativeId(conversationId) {
  const message = await Message.findOne({
    where: {
      conversationId
    },
    order: [['relativeId', 'DESC']],
    attributes: ['relativeId']
  })

  return message ? message.relativeId : null
}

async function checkUserHasAccessToMessage(conversationId, relativeId, user) {
  const message = await fetchMessageOwnedByUser(conversationId, relativeId, user)

  if (!message) {
    throw new WSRequestError('Сообщения с таким id не существует')
  }

  return message
}

async function checkMessageReadByUser(message, user) {
  const count = await ReadMessage.count({
    where: {
      messageId: message.id,
      userId: user.id
    }
  })

  return count !== 0
}


module.exports = {
  getMessage,
  getDeletedMessage,
  getMessages,
  editMessage,
  readMessage,
  saveMessage,
  deleteMessage,
  checkMessageReadByUser,
  checkUserHasAccessToMessage,
  getIncludesForMessage
}