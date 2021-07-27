
function validateUsername(username){
  const re = new RegExp('^[a-zA-Z0-9]+$')

  return (3 <= username.length) && (username.length <= 27) && re.test(username)
}