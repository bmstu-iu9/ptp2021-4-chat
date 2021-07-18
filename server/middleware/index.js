const express = require("express");
const bodyParser = require("body-parser");
const {publicPath} = require("../config");


module.exports = (app) => {
  // Настройка middleware
  app.use(express.static(publicPath, {
    index: false,
    extensions: ['html']
  }))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
}