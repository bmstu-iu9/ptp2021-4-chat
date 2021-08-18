const WSError = require('../../misc/WSError')
const {Conversation} = require('../../database/models/conversation')
const {ConversationParticipant} = require('../../database/models/conversation')


async function getConversation(conversationId, user) {
  const conversationEntry = (await Conversation.findOne({
    where: {
      id: conversationId
    },
    include: {
      model: ConversationParticipant,
      attributes: [],
      where: {
        userId: user.id
      }
    }
  }))

  if (!conversationEntry) {
    throw new WSError(`Conversation с указанным id не найден (id=${conversationId})`)
  }

  return {
    ...conversationEntry.toJSON(),
    generationTimestamp: Date.now()
  }
}


module.exports = {
  getConversation
}