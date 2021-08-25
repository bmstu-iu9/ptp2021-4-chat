import {ConversationsList} from './virtualObjects.js'
import * as render from './renderConversations.js'

export class SidePanel {
  conversationsList
  openedConversation
  conversationOnclickFunc
  username
  userId

  constructor(conversationOnclickFunc) {
    this.conversationsList = new ConversationsList()
    this.conversationOnclickFunc = conversationOnclickFunc
  }

  setUserInfo(username, id) {
    this.username = username
    this.userId = id
  }

  addConversation(update) {
    if (this.conversationsList.get(update.conversation.id)) {
      throw new Error(`Диалог с id=${update.conversation.id} уже существует!`)
    }
    const conversation = this.conversationsList.create(update.conversation)
    if (update.lastMessage) {
      conversation.addMessage(update.lastMessage, false)
    }
    if (update.messages) {
      update.messages.forEach(
        message => conversation.addMessage(message, false)
      )
    }
    render.renderConversation(conversation.getData(), conversation.getLastMessage().getData(),
      true, this.conversationOnclickFunc)
  }

  unsetConversationActive() {
    if (this.openedConversation) {
      render.unsetConversationActive(this.openedConversation.conversationId)
      this.openedConversation = undefined
    }
  }

  setConversationActive(conversationId) {
    this.unsetConversationActive()

    this.openedConversation = this.conversationsList.get(conversationId)
    render.setConversationActive(conversationId)
  }

}