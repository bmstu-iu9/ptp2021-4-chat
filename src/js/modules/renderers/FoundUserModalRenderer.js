import {foundUserModalUtils as utils} from '../renderUtils.js'


class FoundUserModalRenderer {
  constructor(parentClassName) {
    this.DOMObjects = utils.getDOMObjects(parentClassName)
    this.classNames = utils.getPredefinedClassNames(parentClassName)


    this.DOMObjects.closeButton.onclick = this.hide.bind(this)
    this.setTranslateYValue().then(() => {
      this.DOMObjects.modal.style.visibility = 'visible'
    })

    this.displayed = false

    window.addEventListener('resize', () => this.setTranslateYValue())
  }

  setTranslateYValue() {
    const difference = this.calculateHeightDifference()
    this.DOMObjects.modal.style.transform = `translateY(${difference}px)`

    return this.getAnimationTimeoutPromise()
  }

  showFound(userState, onClickCallback) {
    if (this.displayed) {
      this.hide().then(() => this.showFound(userState, onClickCallback))
      return
    }

    const username = userState.username

    if (!validateUsername(username)) {
      this.showIncorrect()
      return
    }

    if (!onClickCallback) {
      this.DOMObjects.modal.classList.add(this.classNames.currentUser)
    }

    this.DOMObjects.title.textContent = 'Пользователь найден!'
    this.DOMObjects.username.textContent = username

    this.setTranslateYValue().then(() => {
      this.DOMObjects.sendButton.onclick = onClickCallback
      this.display()
    })
  }

  showNotFound(username) {
    if (this.displayed) {
      this.hide().then(() => this.showNotFound(username))
      return
    }

    if (!validateUsername(username)) {
      this.showIncorrect()
      return
    }

    this.DOMObjects.modal.classList.add(this.classNames.error)
    this.DOMObjects.title.textContent = 'Пользователь не найден!'
    this.DOMObjects.username.textContent = username

    this.setTranslateYValue().then(() => this.display())
  }

  showIncorrect() {
    if (this.displayed) {
      this.hide().then(() => this.showIncorrect())
      return
    }

    this.DOMObjects.modal.classList.add(this.classNames.incorrect)
    this.DOMObjects.title.textContent = 'Некорректно заданное имя!'

    this.setTranslateYValue().then(() => this.display())
  }

  display() {
    this.displayed = true
    const parentHeight = this.DOMObjects.parent.offsetHeight

    const modal = this.DOMObjects.modal
    modal.style.visibility = 'visible'
    modal.style.transform = `translateY(-${parentHeight}px)`

    return this.getAnimationTimeoutPromise()
  }

  hide() {
    this.displayed = false
    const difference = this.calculateHeightDifference()

    const modal = this.DOMObjects.modal

    modal.style.transform = `translateY(${difference}px)`

    return this.getAnimationTimeoutPromise().then(() => {
      modal.style.visibility = 'hidden'
      this.cleanupStyles()
    })
  }

  cleanupStyles() {
    this.DOMObjects.modal.classList.remove(...Object.values(this.classNames))
  }

  calculateHeightDifference() {
    const parentHeight = this.DOMObjects.parent.offsetHeight
    const modalHeight = this.DOMObjects.modal.offsetHeight
    return modalHeight - parentHeight + 2
  }

  getAnimationTimeoutPromise() {
    const transitionDuration = parseFloat(getComputedStyle(this.DOMObjects.modal).transitionDuration)
    return new Promise((resolve) => {
      setTimeout(resolve, transitionDuration * 1000)
    })
  }
}


export default FoundUserModalRenderer