const HTTPError = require('./HTTPError')
const {
  errors,
  validateUsername,
  validatePassword
} = require('../../common/common')


/**
 * Оборачивает хендлер в функцию, которая верным образом обрабатывает
 * исключение в случае его возникновения
 */
function wrapAsyncFunction(asyncFunction) {
  return async (...args) => {
    const next = args[args.length - 1]
    return await asyncFunction(...args).catch(next)
  }
}

/**
 * Проверяет username и password при помощи общих функций валидации
 * и в случае их некорректности выбрасывает исключение (только для express)
 * @param username - имя пользователя
 * @param password - пароль
 */
function validateUsernameAndPassword(username, password) {
  if (typeof username !== 'string'
    || typeof password !== 'string'
    || !validateUsername(username)
    || !validatePassword(password)
  ) {
    throw new HTTPError(errors.incorrectBody)
  }
}

function mapArrayToObject(array, mapper) {
  return array.reduce((result, item) => {
    result[item] = mapper(item)
    return result
  }, {})
}

function intersectObjectKeys(o1, o2) {
  const [k1, k2] = [Object.keys(o1), Object.keys(o2)]
  const [first, next] = k1.length > k2.length ? [k2, o1] : [k1, o2]

  return first.filter(k => k in next)
}


module.exports = {
  wrapAsyncFunction,
  validateUsernameAndPassword,
  mapArrayToObject,
  intersectObjectKeys
}