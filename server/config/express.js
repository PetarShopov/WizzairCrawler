const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

module.exports = (app) => {
	app.use(cookieParser())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())
	app.use(cors())
	app.use(express.static('public'))
	console.log('Express ready!')
}
