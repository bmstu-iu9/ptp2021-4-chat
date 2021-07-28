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
 * исключение в случае его возникновения:
 * * Если исключение содержит ключ `code` и при этом заголовки ещё
 * не были отправлены, то отправляется ответ с HTTP-статусом равным `code`
 * и сообщением, содержащимся в объекте ошибки
 * * В противном случае ошибка передаётся к обработчикам ошибок путем
 * вызова функции `next(error)`
 */
function wrapAsyncHandler(asyncFunction) {
  return async (request, response, next) => {
    try {
      return await asyncFunction(request, response)
    } catch (error) {
      if (error.code && !response.headersSent) {
        return response.status(error.code).send(error.message || '')
      }

      next(error)
    }
  }
}


module.exports = {
  createError,
  wrapAsyncHandler
}