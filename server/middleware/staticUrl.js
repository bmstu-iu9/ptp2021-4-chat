function redirectIfUrlContainsExtension(request, response, next) {
  let path = request.path
  if (path.endsWith('.html')) {
    path = path.replace(/\.[^/.]+$/, "")
  }

  if (path === '/index') {
    path = '/'
  }

  if (path !== request.path) {
    return response.redirect(path)
  }

  next()
}


module.exports = {
  redirectIfUrlContainsExtension
}