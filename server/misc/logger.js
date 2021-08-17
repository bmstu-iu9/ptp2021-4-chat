const fs = require('fs')
const path = require('path')


const logLevels = {
  DEBUG: 'DEBUG',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
}


class Logger {
  constructor(options, consoleLogLevels = []) {
    this.options = this.parseOptions(options)
    this.consoleLogLevels = consoleLogLevels
  }

  parseOptions(options) {
    const levels = {}
    options.forEach(option => {
      option.levels.forEach(level => {
        levels[level] = levels[level] || []
        levels[level].push(option.filePath)
      })
    })

    return levels
  }


  createFolderStructure(filePath) {
    const directory = path.resolve(path.dirname(filePath))
    fs.mkdir(directory, {recursive: true}, error => {
      if (error) {
        throw error
      }
    })
  }

  writeToFile(filePath, message) {
    this.createFolderStructure(filePath)
    fs.appendFileSync(filePath, message, error => {
      if (error) {
        throw error
      }
    })
  }

  formatMessage(message, level) {
    const dateTime = new Date().toUTCString()
    return `[${dateTime}][${level}]: ${message}\n`
  }

  emit(message, level) {
    if (!(level in this.options)) {
      return
    }

    const formatted = this.formatMessage(message, level)

    if (this.consoleLogLevels.includes(level)) {
      console.log(formatted)
    }

    this.options[level].forEach(filePath => {
      this.writeToFile(filePath, this.formatMessage(message, level))
    })
  }

  debug(message) {
    this.emit(message, logLevels.DEBUG)
  }

  warning(message) {
    this.emit(message, logLevels.WARNING)
  }

  error(message) {
    this.emit(message, logLevels.ERROR)
  }
}


module.exports = {
  Logger,
  logLevels
}
