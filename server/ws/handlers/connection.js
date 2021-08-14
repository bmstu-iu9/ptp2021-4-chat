const {checkSession} = require('../../http/services/common')
const {wrapAsyncFunction} = require('../../misc/utils')
const {wss} = require('../../definitions')
const cookie = require('cookie')


wss.onConnection(wrapAsyncFunction(async ({request}) => {
  request.cookies = cookie.parse(request.headers.cookie || '')

  const result = await checkSession(request)

  if (!result) {
    throw new Error('Не предоставлена сессия')
  }
}))