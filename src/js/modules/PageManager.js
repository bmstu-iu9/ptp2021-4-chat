import {ConversationsList} from './virtualObjects.js'
import SidePanelRenderer from './renderers/SidePanelRenderer'
import ConversationWindowRenderer from './renderers/ConversationWindowRenderer'


export class PageManager {
  onClickCallback
  currentUser

  constructor() {
    const list = this.list = new ConversationsList()

    this.sidePanelRenderer = new SidePanelRenderer()
    this.conversationWindowRenderer = new ConversationWindowRenderer()

    this.updater = new VirtualObjectUpdater(list)
    this.conversationManager = new ConversationManager(list, this.conversationWindowRenderer)
  }

  getUpdater() {
    return this.updater
  }

  getConversationManager() {
    return this.conversationManager
  }

  setCurrentUser(userUpdate) {
    this.currentUser = userUpdate
  }

  getCurrentUser() {
    return this.currentUser
  }

  setSidePanelOnClickHandler(onClickCallback) {
    this.onClickCallback = onClickCallback
  }

  renderSidePanel() {
    this.sidePanelRenderer.render(this.list, this.onClickCallback)
  }

  renderConversation() {
    this.conversationWindowRenderer.render(this.list.getActive())
  }

  rerenderConversation() {
    this.conversationWindowRenderer.rerender(this.list.getActive())
  }
}


class VirtualObjectUpdater {
  constructor(conversationList) {
    this.list = conversationList
  }

  applyConversationUpdate(update) {
    const conversationId = update.conversation.id
    const conversation = this.list.get(conversationId)
    if (conversation) {
      conversation.update(update.conversation)
    } else {
      this.list.create(update.conversation)
    }

    return conversation
  }

  applyNewMessageUpdate(update) {
    const conversation = this.list.get(update.conversation.id)
    conversation.addMessage(update.message)
  }

  applyLastMessageUpdate(update) {
    const conversation = this.list.get(update.conversation.id)

    if (!update.lastMessage) {
      conversation.setAllMessagesLoaded(true)
      return
    }

    conversation.addMessage(update.lastMessage)
  }

  applyMessagesUpdate(update) {
    const conversation = this.list.get(update.conversation.id)

    update.messages.forEach(messageUpdate => conversation.addMessage(messageUpdate))

    if (update.messages.length === 0) {
      conversation.setAllMessagesLoaded()
    }
  }

  applyNewMessageStateUpdate(update) {
    const conversation = this.list.get(update.conversation.id)
    conversation.updateMessage(update.messageState)

    if (Object.values(conversation.getAllMessages()).length === 0) {
      conversation.setAllMessagesLoaded(true)
    }
  }
}


class ConversationManager {
  constructor(conversationList, conversationWindowRenderer) {
    this.list = conversationList
    this.renderer = conversationWindowRenderer
    this.readMessagesCache = {}
  }

  isActive(conversationId) {
    const active = this.list.getActive()
    return active && active.id === conversationId
  }

  setActive(conversationId) {
    this.list.setActive(conversationId)
  }

  unsetActive() {
    this.list.unsetActive()
  }

  getActiveId() {
    const active = this.list.getActive()
    return active ? active.getData().id : undefined
  }

  isPreloaderInViewport() {
    return this.renderer.isPreloaderInViewport()
  }

  isNeedLoad() {
    const active = this.list.getActive()

    if (!active) {
      return undefined
    }

    const message = active.getEarliestNotSelfMessage()
    return !active.isAllMessagesLoaded() && message && !message.getData().read
  }

  getMessagesIdsToMarkAsRead(relativeIds) {
    const active = this.list.getActive()

    if (!active) {
      return undefined
    }

    this.readMessagesCache[active.id] = this.readMessagesCache[active.id] || []

    return Object.values(active.getAllMessages())
    .filter(message => {
      const id = message.getData().relativeId
      return (
        !message.getData().self
        && !message.getData().read
        && relativeIds.includes(id)
        && !this.readMessagesCache[active.id].includes(id)
      )
    })
    .map(message => {
      const id = message.getData().relativeId
      this.readMessagesCache[active.id].push(id)

      return id
    })
  }

  getRenderedMessages() {
    return this.renderer.getRenderedMessages()
  }

  getEarliestMessageId() {
    const active = this.list.getActive()

    if (!active) {
      return undefined
    }

    const message = active.getEarliestMessage()

    if (!message) {
      return undefined
    }

    return message.getData().relativeId
  }

  getEarliestUnreadNotSelfMessageId() {
    const active = this.list.getActive()

    if (!active) {
      return undefined
    }

    const message = active.getEarliestNotSelfUnreadMessage()

    if (!message) {
      return undefined
    }

    return message.getData().relativeId
  }
}
