/* Пример уведомления нового сообщения */
export const exampleMessageNotification = {
  notificationType: "newMessage",
  conversation: {
    id: 0,
    type: "dialog",
    username: "Igor Pavlov",
    unreadCount: 0,
    generationTimestamp: 100,
  },
  message: {
    relativeId: 0,
    self: false,
    read: true,
    author: {
      username: "Igor Pavlov"
    },
    creationTimestamp: 120,
    edited: false,
    content: {
      type: "text",
      value: "Привет!",
      files: null,
    },
    generationTimestamp: 122
  }
}

/* Пример ответа сервера на getAllConversations */

export const exampleConversationNotification = [{
  conversation: {
    id: 0,
    type: "dialog",
    username: "Igor Pavlov",
    unreadCount: 0,
    generationTimestamp: 100,
  },
  lastMessage: {
    relativeId: 0,
    self: false,
    read: true,
    author: {
      username: "Igor Pavlov"
    },
    creationTimestamp: 120,
    edited: false,
    content: {
      type: "text",
      value: "Привет!",
      files: null,
    },
    generationTimestamp: 122
  }
}]