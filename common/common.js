function isNode(){
    return (typeof process !== 'undefined') && (process.release.name === "node");
}

function validateUsername(username){
    const re = new RegExp('^[a-zA-Z0-9]+$')
    return (3 <= username.length) && (username.length <= 27) && re.test(username)
}

function validatePassword(password) {
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

    return password.length >= 6 && hasLowercase && hasDigits && hasUppercase
}

if(isNode()){
    module.exports = {
        validatePassword,
        validateUsername
    }
}