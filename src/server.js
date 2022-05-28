const express = require('express')
const router = require('./route')
const server = express()
const path = require('path')

server.set('view engine', 'ejs')

server.set('views', path.join(__dirname, 'views'))

server.use(express.static('public'));

server.use(express.urlencoded({extended: true}))

server.use(router)

server.listen(5000, () => console.log("Servidor está rodando na porta 5000"))