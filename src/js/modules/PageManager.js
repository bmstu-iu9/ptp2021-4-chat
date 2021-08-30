import {ConversationsList} from './virtualObjects.js'
import SidePanelRenderer from './renderers/SidePanelRenderer'
import ConversationWindowRenderer from './renderers/ConversationWindowRenderer'


export class PageManager {
  conversationsList
  onClickCallback
  currentUser

  constructor() {
    this.conversationsList = new ConversationsList()
    this.sidePanelRenderer = new SidePanelRenderer()
    this.conversationWindowRenderer = new ConversationWindowRenderer()
  }

  hasConversation(conversationId) {
    return this.conversationsList.includesConversationById(conversationId)
  }

  setCurrentUser(userUpdate) {
    this.currentUser = userUpdate
  }

  getCurrentUser() {
    return this.currentUser
  }

  setSidePanelConversationOnClickCallback(onClickCallback) {
    this.onClickCallback = onClickCallback
  }

  setActiveConversation(conversationId) {
    this.sidePanelRenderer.setConversationActive(conversationId)
    this.conversationsList.setActive(conversationId)
  }

  unsetActiveConversation() {
    const conversation = this.conversationsList.getActive()
    this.conversationsList.unsetActive()
    this.sidePanelRenderer.setConversationNotActive(conversation.id)
  }

  getActiveConversationId() {
    const conversation = this.conversationsList.getActive()
    if (!conversation) {
      return null
    }

    return conversation.id
  }

  isConversationFullyLoaded() {
    return this.conversationsList.getActive().isAllMessagesLoaded()
  }

  getConversationEarliestMessageRelativeId() {
    const message = this.conversationsList.getActive().getEarliestMessage()

    if (!message) {
      return null
    }
    return message.getData().relativeId
  }

  getConversationEarliestNotSelfMessageRead() {
    const message = this.conversationsList.getActive().getEarliestNotSelfMessage()

    if (!message) {
      return true
    }

    return message.getData().read
  }

  applyConversationUpdate(conversationUpdate) {
    const conversationId = conversationUpdate.id
    const conversation = this.conversationsList.get(conversationId)
    if (conversation) {
      conversation.update(conversationUpdate)
    } else {
      this.conversationsList.create(conversationUpdate)
    }

    return conversation
  }

  applyNewMessageUpdate(conversationId, newMessageUpdate) {
    const conversation = this.conversationsList.get(conversationId)
    conversation.addMessage(newMessageUpdate)
  }

  applyLastMessageUpdate(conversationId, lastMessageUpdate) {
    const conversation = this.conversationsList.get(conversationId)

    if (!lastMessageUpdate) {
      conversation.setAllMessagesLoaded(true)
      return
    }

    conversation.addMessage(lastMessageUpdate)
  }

  applyMessagesUpdate(conversationId, messagesUpdate) {
    const conversation = this.conversationsList.get(conversationId)

    const previousEarliestNotSelfMessage = conversation.getEarliestNotSelfMessage()

    messagesUpdate.forEach(messageUpdate => conversation.addMessage(messageUpdate))

    const earliestNotSelfMessage = conversation.getEarliestNotSelfMessage()

    if (!earliestNotSelfMessage) {
      return {needLoadMore: false}
    }

    const report = {
      needLoadMore: previousEarliestNotSelfMessage !== earliestNotSelfMessage && !earliestNotSelfMessage.getData().read,
      earliestNotSelfUnreadMessageRelativeId: earliestNotSelfMessage.getData().relativeId
    }

    if (messagesUpdate.length === 0) {
      conversation.setAllMessagesLoaded(true)
    }

    return report
  }

  renderSidePanel() {
    this.sidePanelRenderer.render(this.conversationsList.getAllSorted(), this.onClickCallback)
  }

  renderConversation() {
    this.conversationWindowRenderer.render(this.conversationsList.getActive())
  }

  newMessageHandler(update) {
    const conversation = this.applyConversationUpdate(update.conversation)
    this.applyNewMessageUpdate(update.message)

    this.renderSidePanel()
    if (conversation === this.conversationsList.getActive()) {
      this.renderConversation()
    }
  }

  newConversationHandler(update) {
    this.applyConversationUpdate(update.conversation)

    this.renderSidePanel()
  }

  runUpdateHandlers(update) {
    if (update.notificationType === 'newConversation') {
      this.newConversationHandler(update)
    }

    if (update.notificationType === 'newMessage') {
      this.newMessageHandler(update)
    }
  }
}