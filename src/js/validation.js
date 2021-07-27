
function isValidUserName(userName){
  var re=new RegExp('^[a-zA-Z0-9]+$');
  if ((3 <= userName.length) && (userName.length <= 27) && re.test(userName)){
    return true
  } else {
    return false
  }
}