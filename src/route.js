const express = require("express")
const router = express.Router();
const UserController = require('./controllers/UserController')


router.get('/login', (req, res) => res.render("index"))
router.get('/', UserController.isLog)

router.get('/signIn', (req, res) => res.render('signIn'))
router.get('/logOut/:username', UserController.logOut)

router.post('/user', UserController.create)
router.post('/login', UserController.login)

module.exports = router;