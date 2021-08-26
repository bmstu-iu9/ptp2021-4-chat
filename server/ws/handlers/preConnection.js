const {checkSession} = require('../../http/services/common')
const {wss} = require('../../definitions')
const cookie = require('cookie')
const {getUser} = require('../services/users')


wss.onPreConnection(async context => {
  const request = context.request
  request.cookies = cookie.parse(request.headers.cookie || '')

  const result = await checkSession(request)

  if (!result) {
    context.redirectUrl = '/entry'
    return
  }

  const {session, ...user} = await getUser(request.cookies.sessionId)

  context.current = {
    user,
    session
  }
})