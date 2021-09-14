import {conversationWindowUtils as utils} from '../renderUtils.js'


class ConversationWindowRenderer {
  renderedMessages

  render(conversation) {
    let messagesDOM = conversation.isAllMessagesLoaded() ?
      '' :
      utils.getConversationWindowPreloaderChunk()

    Object.values(conversation.getAllMessages()).forEach(message => {
      messagesDOM += utils.getConversationMessageChunk(message)
    })

    // messagesDOM += utils.getConversationWindowUnreadCounterChunk(conversation)

    utils.setConversationWindowTitle(conversation.name)
    utils.renderConversation(messagesDOM)

    this.renderedMessages = utils.getAllConversationMessages()
  }

  rerender(conversation) {
    Object.values(conversation.getUpdatedMessages()).forEach(message => {
      const messageView = utils.getConversationMessageView(message.getData().relativeId)
      console.log(messageView)
      if (!messageView) { // Новое сообщение
        utils.insertMessageToConversation(utils.getConversationMessageChunk(message))
      } else {
        utils.updateConversationMessageView(message)
      }
    })

    this.renderedMessages = utils.getAllConversationMessages()
  }

  isPreloaderInViewport() {
    return utils.isMessagesPreloaderInViewport()
  }

  getRenderedMessages() {
    return this.renderedMessages
  }
}


export default ConversationWindowRenderer