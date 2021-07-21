const {passwordMinLength} = require("../constants");
const {sessionLifetime} = require("../constants");
const {Session} = require("../models/session");

// TODO: избавиться от повторяющегося кода
function validate(request, response, next) {
  const {username, password} = request.body

  if (!check(username, password) || password.length < passwordMinLength) {
    return response.status(400)
                   .send('Некорректно заданы параметры username или password')
  }

  next()
}

function checkProvided(request, response, next) {
  const {username, password} = request.body
  if (!check(username, password)) {
    return response.status(400)
                   .send('Некорректно заданы параметры username или password')
  }

  next()
}

function check(login, password) {
  if (!login || !password) {return false}
  if (typeof login !== 'string' || typeof password !== 'string') {return false}
  return true
}

async function checkSessionExpirationDate(request, response, next){
  if(request.path.startsWith("/api/")){next()}
  const sessionId = request.cookies.sessionId
  if(sessionId){
    const session = await Session.findOne({where:{sessionId:sessionId}})
    if(!session){
      response.redirect("/login")
    }else if(session.expirationDate.getSeconds() <= Date.now()){
      const newExpirationDate = Date.now() + sessionLifetime
      await session.update({sessionId, newExpirationDate})
      next()
    }else{
      next()
    }
  }else{
    response.redirect("/login");
  }
}

module.exports = {
  validate,
  checkSessionExpirationDate,
  checkProvided
}
