const express = require("express");
const bodyParser = require("body-parser");
const {publicPath} = require("../config");
const cookieParser = require("cookie-parser")


module.exports = (app) => {
  // Настройка middleware
  app.use(express.static(publicPath, {
    index: false,
    extensions: ['html']
  }))
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
}