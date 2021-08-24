/* Пример уведомления нового сообщения */
export const exampleMessageNotification = {
  notificationType: "newMessage",
  conversation: {
    id: 0,
    unreadCount: 0,
    generatedAt: "1629739557", //unixtimestamp
  },
  message: {
    relativeId: 0,
    server: false,
    self: false,
    read: true,
    user: {
      id: 0,
      username: "Igor Pavlov",
    },
    createdAt: "1629739557",

    content: {
      type: "text",
      value: "Привет!",
      files: null,
    },
    generatedAt: "1629739557"
  }
}

/* Пример ответа сервера на getAllConversations */

export const exampleConversationNotification = [{
  conversation: {
    id: 0,
    type: "dialog",
    username: "Igor Pavlov",
    unreadCount: 0,
    generatedAt: "100",
  },
  lastMessage: {
    relativeId: 0,
    self: false,
    read: true,
    author: {
      username: "Igor Pavlov"
    },
    createdAt: "120",
    edited: false,
    content: {
      type: "text",
      value: "Привет!",
      files: null,
    },
    generatedAt: "122"
  }
}]