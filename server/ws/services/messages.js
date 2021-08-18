const {ReadMessage} = require('../../database/models/message')
const {Op} = require('sequelize')
const {messagesCountPerRequest} = require('../../constants')
const {Content} = require('../../database/models/content')
const {User} = require('../../database/models/user')
const {Sequelize} = require('sequelize')
const {Message} = require('../../database/models/message')

async function getMessagesFromConversation(conversationId, user, relativeId) {
  const whereOption = {
    conversationId
  }

  if (Number.isInteger(relativeId)) {
    whereOption.relativeId = {
      [Op.lt]: relativeId
    }
  }

  const messages = (await Message.findAll({
    attributes: {
      include: [
        [Sequelize.literal('(SELECT COUNT(*) > 0 FROM "readMessages" ' +
          ' WHERE "readMessages"."messageId"="message"."id")'), 'read']
      ]
    },
    where: whereOption,
    include: [User, Content],
    order: [['relativeId', 'DESC']],
    limit: messagesCountPerRequest
  })).map(messageModel => {
    const message = messageModel.toJSON()
    message.self = message.user.id === user.id
    cleanupMessage(message)

    return message
  })

  return {
    generationTimestamp: Date.now(),
    list: messages
  }
}

async function getUnreadCount(messages) {
  const notSelfMessages = messages.filter(message => !message.self)
  return notSelfMessages.length - await ReadMessage.count({
    where: {
      messageId: {
        [Op.in]: notSelfMessages.map(message => message.id)
      }
    }
  })
}

function cleanupMessage(message) {
  delete message.id
  delete message.deleted
  delete message.editedAt
  delete message.deletedAt
  delete message.conversationId
  delete message.userId
  delete message.contentId

  if (!message.self) {
    delete message.read
  }

  delete message.user.id
  delete message.user.createdAt
  delete message.content.id
}


module.exports = {
  getMessagesFromConversation,
  getUnreadCount
}