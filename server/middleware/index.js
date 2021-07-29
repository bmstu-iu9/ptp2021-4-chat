const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {app} = require('../definitions')
const {publicPath, commonPath} = require('../config')
const {urls} = require('../constants')
const {staticRouter, apiRouter} = require('../definitions')
const {
  redirectIfSessionProvided,
  redirectIfSessionNotProvided
} = require('./session')
const {redirectIfUrlContainsExtension} = require('./staticUrl')
const {errorHandlersPipeline} = require('./errorHandler')


// Настройка middleware для статики
staticRouter.use(redirectIfUrlContainsExtension)
staticRouter.use(redirectIfSessionProvided(
  urls.index,
  urls.authenticationAndRegistration
))
staticRouter.use(redirectIfSessionNotProvided(
  urls.authenticationAndRegistration,
  urls.index
))
staticRouter.use(express.static(publicPath, {
  extensions: ['html']
}))
staticRouter.use('/common', express.static(commonPath))

// Настройка общих middleware
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Установка роутеров
app.use('/api', apiRouter)
app.use('/', staticRouter)

// Установка обработчиков ошибок
app.use(errorHandlersPipeline)
