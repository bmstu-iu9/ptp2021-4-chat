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
      const messageView = document.querySelector(`[data-message-id="${message.getData().relativeId}"]`)

      const messageDOM = utils.getConversationMessageChunk(message)
      // Новое сообщение
      if (!messageView) {
        utils.insertMessageToConversation(messageDOM)
      } else {
        // TODO: сделать, чтобы у существующего элемента менялись классы
        messageView.outerHTML = messageDOM
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