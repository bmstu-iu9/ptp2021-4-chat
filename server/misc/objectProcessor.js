class ObjectProcessorError extends Error {
}


class ObjectProcessorConfigValidationError extends Error {
}


class ObjectProcessorGetPropertyError extends Error {
}


function validateObjectProcessorConfig(config) {
  const exclude = config.exclude
  const rules = config.rules

  if (exclude) {
    if (!(exclude instanceof Array)) {
      throw new ObjectProcessorConfigValidationError(
        'Свойство exclude должно быть массивом'
      )
    }
    if (!exclude.every(property => typeof property === 'string')) {
      throw new ObjectProcessorConfigValidationError(
        'Массив exclude должен содержать только строки'
      )
    }
  }

  if (rules) {
    if (!(rules instanceof Array)) {
      throw new ObjectProcessorConfigValidationError(
        'Свойство rules должно быть массивом'
      )
    }
    if (!rules.every(rule => (rule instanceof Array) && rule.length === 2)) {
      throw new ObjectProcessorConfigValidationError(
        'Элементы массива rules должны быть массивами длины 2'
      )
    }
    if (!rules.every(rule => rule[0].every(property => typeof property === 'string'))) {
      throw new ObjectProcessorConfigValidationError(
        'Элементы массива rules должны быть массивами, содержащими в себе в качестве первого элемента массив строк'
      )
    }
    if (!rules.every(rule => typeof rule[1] === 'function')) {
      throw new ObjectProcessorConfigValidationError(
        'Элементы массива rules должны быть массивами, содержащими в себе в качестве второго элемента функцию'
      )
    }
  }
}

function processObjectAccordingConfig(object, config) {
  validateObjectProcessorConfig(config)

  const exclude = config.exclude
  const rules = config.rules

  if (exclude) {
    processExclude(object, exclude)
  }

  if (rules) {
    processRules(object, rules)
  }

  return object
}

function processExclude(object, excludeConfig) {
  excludeConfig.forEach(property => {
    const propertyRequest = getPropertyRequest('object', property)
    try {
      eval(`delete ${propertyRequest}`)
    } catch (e) {
    }
  })
}

function processRules(object, rulesConfig) {
  rulesConfig.forEach(rule => {
    const [properties, func] = rule

    let arguments
    try {
      arguments = properties.map(property => getProperty(object, property))
    } catch (error) {
      if (!(error instanceof ObjectProcessorGetPropertyError)) {
        throw error
      }
      return
    }

    let actions
    try {
      actions = func(...arguments)
    } catch (error) {
      throw new ObjectProcessorError(
        `В функции проверки произошла ошибка\n${error.stack}`
      )
    }

    if (!actions) {
      return
    }

    if (!(actions instanceof Array)) {
      actions = [actions]
    }

    actions.forEach(action => processRulesAction(object, action))
  })
}

function processRulesAction(object, action) {
  if (action.set) {
    const [property, value] = action.set
    const propertyRequest = getPropertyRequest('object', property)

    try {
      eval(`${propertyRequest} = value`)
    } catch {
    }
  }

  if (action.del) {
    const properties = action.del
    properties.forEach(property => {
      const propertyRequest = getPropertyRequest('object', property)

      try {
        eval(`delete ${propertyRequest}`)
      } catch {
      }
    })
  }
}

function getPropertyRequest(objectName, property) {
  const keys = parseProperty(property)
  return keys.reduce((request, key) => {
    request += `['${key}']`
    return request
  }, objectName)
}

function getProperty(object, property) {
  const keys = parseProperty(property)
  let value = object
  keys.forEach(key => {
    try {
      value = value[key]
    } catch {
      throw new ObjectProcessorGetPropertyError()
    }
  })

  return value
}

function parseProperty(property) {
  return property.split('.')
}


module.exports = processObjectAccordingConfig