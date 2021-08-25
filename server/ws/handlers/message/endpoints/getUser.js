module.exports = async context => {
  context.socket.answer(context.current.user)
}