module.exports = async (context, localContext) => {
  localContext.answer(context.current.user)
}