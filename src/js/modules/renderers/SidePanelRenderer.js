import {sidePanelUtils as utils} from '../renderUtils.js'


class SidePanelRenderer {
  render(conversations, onClickHandler) {
    let sidePanelDOM = ''

    conversations.forEach(conversation => {
      sidePanelDOM += utils.getSidePanelConversationChunk(conversation, conversation.getLastMessage())
    })

    utils.renderSidePanel(sidePanelDOM)

    utils.getAllSidePanelConversations().forEach(conversationView => {
      conversationView.onclick = () => onClickHandler(parseInt(conversationView.dataset.conversationId))
    })
  }

  setConversationActive(conversationId) {
    this.getConversation(conversationId).classList.add('side-panel__list__conversation_active')
  }

  setConversationNotActive(conversationId) {
    this.getConversation(conversationId).classList.remove('side-panel__list__conversation_active')
  }

  getConversation(conversationId) {
    return document.querySelector(`[data-conversation-id="${conversationId}"]`)
  }

}


export default SidePanelRenderer