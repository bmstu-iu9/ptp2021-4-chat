/* Пример уведомления нового сообщения */
export const exampleMessageNotification = {
  notificationType: "newMessage",
  conversation: {
    id: 0,
    unreadCount: 0,
    generatedAt: 1629739557, //unixtimestamp
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
    createdAt: 1629739557,

    content: {
      type: "text",
      value: "Привет!",
      files: null,
    },
    generatedAt: 1629739557
  }
}

/* Пример ответа сервера на getAllConversations */

export const exampleConversationNotification = [{
  conversation: {
    id: 0,
    type: "dialog",
    unreadCount: 0,
    participants: [{
      id: 0,
      username: "Igor Pavlov",
    }],
    generatedAt: 1629739557
  },
  lastMessage: {
    relativeId: 0,
    server: false,
    self: true,
    read: false,
    user: {
      id: 0,
      username: "Igor Pavlov",
    },
    createdAt: 1629739557,
    edited: false,
    content: {
      type: "text",
      value: "Привет!",
      files: null,
    },
    generatedAt: 1629739557
  }
}, {
  conversation: {
    id: 1,
    type: "dialog",
    unreadCount: 0,
    participants: [{
      id: 120,
      username: "skorb",
    }],
    generatedAt: 1629739557
  },
  lastMessage: {
    relativeId: 0,
    server: false,
    self: false,
    read: false,
    user: {
      id: 120,
      username: "skorb",
    },
    createdAt: 1629739590,
    edited: false,
    content: {
      type: "text",
      value: "Кинул хмурого",
      files: null,
    },
    generatedAt: 1629739590
  }
}]

