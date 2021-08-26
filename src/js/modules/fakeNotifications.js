/* Пример уведомления нового сообщения */
export const exampleMessageNotification = {
  notificationType: "newMessage",
  conversation: {
    id: 0,
    unreadCount: 0,
    generatedAt: new Date(1629739557).toISOString()
  },
  message: {
    relativeId: 0,
    server: false,
    self: false,
    read: true,
    user: {
      id: 0,
      username: "Igor Pavlov"
    },
    createdAt: new Date(1629739557).toISOString(),

    content: {
      type: "text",
      value: "Привет!",
      files: null
    },
    generatedAt: new Date(1629739557).toISOString()
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
    generatedAt: new Date(1629739557).toISOString()
  },
  lastMessage: {
    relativeId: 0,
    server: false,
    self: true,
    read: false,
    user: {
      id: 0,
      username: "Igor Pavlov"
    },
    createdAt: new Date(1629739557).toISOString(),
    edited: false,
    content: {
      type: "text",
      value: "Привет!",
      files: null
    },
    generatedAt: new Date(1629739557).toISOString()
  }
}, {
  conversation: {
    id: 1,
    type: "dialog",
    unreadCount: 0,
    participants: [{
      id: 120,
      username: "Skorb"
    }],
    generatedAt: new Date(1629739557).toISOString()
  },
  lastMessage: {
    relativeId: 0,
    server: false,
    self: false,
    read: false,
    user: {
      id: 120,
      username: "skorb"
    },
    createdAt: new Date(1629739557).toISOString(),
    edited: false,
    content: {
      type: "text",
      value: "Кинул хмурого",
      files: null
    },
    generatedAt: new Date(1629739557).toISOString()
  }
}]

