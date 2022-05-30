const express = require("express")
const router = express.Router();
const UserController = require('./controllers/UserController')



//Cadastro
router.get('/create-account', (req, res) => res.render('signIn'))
router.post('/create-account', UserController.create)

//Login
router.get('/login', (req, res) => res.render("index"))
router.post('/login', UserController.login)
router.get('/isLog', UserController.isLog)
router.get('/logOut/:username', UserController.logOut)

//Usuário
router.get('/user/:username', UserController.user)


module.exports = router;