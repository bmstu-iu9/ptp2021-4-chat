import {conversationWindowUtils as utils} from '../renderUtils.js'


class ConversationWindowRenderer {

  setTitle(title) {
    utils.setConversationWindowTitle(title)
  }

  render(conversation) {
    let conversationDOM = conversation.isAllMessagesLoaded() ? '' : utils.getConversationWindowPreloaderChunk()

    Object.values(conversation.getMessages()).forEach(message => {
      conversationDOM += utils.getConversationMessageChunk(message)
    })

    // conversationDOM += utils.getConversationWindowUnreadCounterChunk(conversation)

    this.setTitle(conversation.name)
    utils.renderConversation(conversationDOM)
  }

  getEarliestUnreadMessageId(messagesStates) {
    Object.keys(messagesStates).forEach(messageState => {
      if (!messageState.self && !messageState.read) {
        return messageState.relativeId
      }
    })

    return null
  }
}


export default ConversationWindowRenderer