import {sidePanelUtils as utils} from '../renderUtils.js'


class SidePanelRenderer {
  render(conversationsList, onClickHandler) {
    let sidePanelDOM = ''

    conversationsList.getAllSorted().forEach(conversation => {
      sidePanelDOM += utils.getSidePanelConversationChunk(conversation, conversation.getLatestMessage())
    })

    utils.renderSidePanel(sidePanelDOM)

    const active = conversationsList.getActive()
    if (active) {
      this.setConversationActive(active.id)
    }

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