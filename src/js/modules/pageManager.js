import {ConversationsList} from './virtualObjects.js'
import * as render from './renderConversations.js'
import {renderMessage} from './renderMessages.js'

export class PageManager {
  conversationsList
  openedConversation
  conversationOnclickFunc
  username
  userId

  constructor() {
    this.conversationsList = new ConversationsList()
  }

  setConversationOnclickHandler(conversationOnclickFunc) {
    this.conversationOnclickFunc = conversationOnclickFunc
  }

  setUserInfo(username, id) {
    this.username = username
    this.userId = id
  }

  hasConversation(conversationId) {
    return this.conversationsList.includesConversationById(conversationId)
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

  openConversation(conversationId) {
    this.setConversationActive(conversationId)
    render.renameOpenedDialog(this.openedConversation.name)

    const loadedMessagesInfo = this.openedConversation.getLastMessages(50)
    for (const message of Object.values(loadedMessagesInfo.messages)) {
      renderMessage(message.getData(), false, true)
    }
  }

  newMessageHandler(update) {
    const conversation = this.conversationsList.get(update.conversation.id)

    if (!conversation) {
      throw new Error(`Пришло сообщение в диалог, которого нет! (id=${update.conversation.id})`)
    }

    conversation.addMessage(update.message, true)

    render.changeConversationLastMessage(conversation.getData().id, update.message.content.text,
      update.message.self)
    render.moveConversationToBegin(conversation.getData().id)

    if (conversation.getData().id === this.openedConversation.getData().id) {
      //do_something
    }
  }

}