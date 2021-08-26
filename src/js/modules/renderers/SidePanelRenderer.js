import {sidePanelUtils as utils} from '../renderUtils.js'


class SidePanelRenderer {
  sidePanel

  constructor(sidePanel) {
    this.sidePanel = sidePanel
  }

  isElementRendered(conversationId) {
    return this.getElement(conversationId) !== null
  }

  renderNewElement(conversationState, lastMessageState, isAddToBegin, onClickCallback) {
    let title
    if (conversationState.type === 'dialog') {
      title = conversationState.participants[0].username
    } else {
      title = conversationState.name
    }

    const sidePanelConversationView = this.createElement(
      conversationState.id, title, lastMessageState, onClickCallback
    )

    const sidePanel = this.sidePanel
    if (isAddToBegin && sidePanel.hasChildNodes()) {
      sidePanel.prepend(sidePanelConversationView)
    } else {
      sidePanel.appendChild(sidePanelConversationView)
    }

    sidePanel.scrollTop = sidePanel.scrollHeight
  }

  moveElementToBegin(conversationId) {
    const conversationView = this.getElement(conversationId)

    const sidePanel = this.sidePanel
    if (sidePanel.hasChildNodes()) {
      sidePanel.prepend(conversationView)
    }
  }

  changeElementLastMessage(conversationId, messageState) {
    const conversationView = this.getElement(conversationId)
    utils.setSidePanelElementLastMessageView(conversationView, messageState)
  }

  setElementActive(conversationId) {
    this.getElement(conversationId).classList.add('active-conversation')
  }

  setElementNotActive(conversationId) {
    this.getElement(conversationId).classList.remove('active-conversation')
  }

  getElement(conversationId) {
    return document.querySelector(`[data-conversation-id="${conversationId}"]`)
  }

  createElement(conversationId, username, messageState, onClickCallback) {
    const conversationView = utils.createSidePanelConversationView(conversationId, username)

    conversationView.onclick = () => onClickCallback(conversationView)

    if (messageState) {
      conversationView.appendChild(utils.createLastMessageView(messageState))
    }

    return conversationView
  }
}


export default SidePanelRenderer