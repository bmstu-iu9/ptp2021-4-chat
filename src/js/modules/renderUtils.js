/* Вспомогательные функции */
function createElementWithClass(elementName, className) {
  let newElem = document.createElement(elementName)
  newElem.setAttribute("class", className)
  return newElem
}

function createTextElement(elementName, className, innerText='') {
  let newElem = document.createElement(elementName)
  newElem.setAttribute("class", className)
  newElem.innerText = innerText
  return newElem
}

function createCustomElement(elementName, className, id=NaN, innerText='') {
  let newElem = document.createElement(elementName)
  newElem.setAttribute("class", className)
  if (id) {
    newElem.setAttribute("id", id)
  }
  newElem.innerText = innerText
  return newElem
}

export {createElementWithClass, createTextElement, createCustomElement}