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
      conversation.addMessage(update.lastMessage)
    }

    if (update.messages) {
      update.messages.forEach(
        message => conversation.addMessage(message)
      )
    }

    let lastMessage
    if (conversation.getLastMessage()) {
      lastMessage = conversation.getLastMessage().getData()
    }
    render.renderConversation(conversation.getData(), lastMessage,
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
    if (!loadedMessagesInfo.allLoaded) {
      return {needLoad: true}
    }

    for (const message of Object.values(loadedMessagesInfo.messages)) {
      renderMessage(message.getData(), false, true)
    }

    return {needLoad: false}
  }

  loadMessages(update) {
    console.log(update)
    const conversation = this.conversationsList.get(update.conversation.id)

    update.messages.forEach(
      message => conversation.addMessage(message)
    )

    const lastMessage = conversation.getLastMessage()
    if (lastMessage) {
      render.changeConversationLastMessage(conversation.getData().id,
        lastMessage.getData().content.value,
        lastMessage.getData().self)
    }
  }

  createMessage(messageUpdate) {
    const conversation = this.conversationsList.get(messageUpdate.conversation.id)

    messageUpdate.message.self = true
    messageUpdate.message.server = false
    messageUpdate.message.user = {id: this.userId, username: this.username}
    messageUpdate.message.edited = false

    conversation.addMessage(messageUpdate.message)
    renderMessage(messageUpdate.message, false, true)
    render.changeConversationLastMessage(conversation.getData().id,
      conversation.getLastMessage().getData().content.value,
      conversation.getLastMessage().getData().self)
  }


  newMessageHandler(update) {
    const conversation = this.conversationsList.get(update.conversation.id)

    if (!conversation) {
      throw new Error(`Пришло сообщение в диалог, которого нет! (id=${update.conversation.id})`)
    }

    conversation.addMessage(update.message)

    render.changeConversationLastMessage(conversation.getData().id,
      conversation.getLastMessage().getData().content.value,
      conversation.getLastMessage().getData().self)
    render.moveConversationToBegin(conversation.getData().id)

    if (conversation.getData().id === this.openedConversation.getData().id) {
      renderMessage(update.message, false, true)
    }
  }

  newConversationHandler(update) {
    const conversation = this.conversationsList.create(update.conversation)

    render.renderConversation(conversation.getData(), undefined,
      true, this.conversationOnclickFunc)
  }

  runHandlers(update) {
    if (update.notificationType === 'newConversation') {
      this.newConversationHandler(update)
    }
    if (update.notificationType === 'newMessage') {
      this.newMessageHandler(update)
    }
  }
}