function isNode() {
  return (typeof process !== 'undefined') && (process.release.name === "node")
}

function validateUsername(username) {
  const re = new RegExp('^[a-zA-Z0-9]+$')
  return (3 <= username.length) && (username.length <= 27) && re.test(username)
}

function validatePassword(password) {
  if (password.length < 6) {
    return false
  }

  let hasUppercase = false
  let hasLowercase = false
  let hasDigits = false

  for (let i = 0; i < password.length; i++) {
    if (password[i] >= 'A' && password[i] <= 'Z') {
      hasUppercase = true
    }

    if (password[i] >= 'a' && password[i] <= 'z') {
      hasLowercase = true
    }

    if (password[i] >= '0' && password[i] <= '9') {
      hasDigits = true
    }
  }

  return hasUppercase && hasLowercase && hasDigits
}

const errors = {
  usernameNotRegistered: {
    code: 401,
    message: 'username-not-registered'
  },
  incorrectPassword: {
    code: 401,
    message: 'incorrect-password'
  },
  usernameAlreadyRegistered: {
    code: 409,
    message: 'username-already-registered'
  },
  incorrectBody: {
    code: 400,
    message: 'incorrect-body'
  }
}


if (isNode()) {
  module.exports = {
    validatePassword,
    validateUsername,
    errors
  }
}