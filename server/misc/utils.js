/**
 * Создает объект Error с указанным HTTP-кодом и сообщением
 * @param code {number} - HTTP-код
 * @param message {string} - сообщение
 * @returns {Error} - объект ошибки
 */
function createError(code, message) {
  const error = new Error()
  error.message = message
  error.code = code
  return error
}

/**
 * Оборачивает хендлер в функцию, которая верным образом обрабатывает
 * исключение в случае его возникновения
 */
function wrapAsyncFunction(asyncFunction) {
  return async (request, response, next) => {
    return await asyncFunction(request, response, next).catch(next)
  }
}


module.exports = {
  createError,
  wrapAsyncFunction
}