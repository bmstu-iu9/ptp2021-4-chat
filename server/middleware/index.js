const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {app} = require('../definitions');
const {publicPath} = require('../config')
const {urls} = require('../constants');
const {staticRouter, apiRouter} = require('../definitions')
const {
  redirectIfSessionProvided,
  redirectIfSessionNotProvided
} = require('./session')
const {redirectIfUrlContainsExtension} = require('./staticUrl')


// Настройка middleware для статики
staticRouter.use(redirectIfUrlContainsExtension)
staticRouter.use(redirectIfSessionProvided(
  urls.index,
  urls.authenticationAndRegister
))
staticRouter.use(redirectIfSessionNotProvided(
  urls.authenticationAndRegister,
  urls.index
))
staticRouter.use(express.static(publicPath, {
  extensions: ['html']
}))

// Настройка общих middleware
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Установка роутеров
app.use('/api', apiRouter)
app.use('/', staticRouter)