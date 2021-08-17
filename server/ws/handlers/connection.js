const {checkSession} = require('../../http/services/common')
const {wrapAsyncFunction} = require('../../misc/utils')
const {wss} = require('../../definitions')
const cookie = require('cookie')
const WSError = require("../../misc/WSError");
const {getUser} = require("../services/user");


wss.onConnection(wrapAsyncFunction(async (context) => {
  const request = context.request
  request.cookies = cookie.parse(request.headers.cookie || '')

  const result = await checkSession(request)

  if (!result) {
    throw new WSError('Не предоставлена сессия')
  }

  context.user = await getUser(request.cookies.sessionId)
}))