const express = require("express")
const router = express.Router();
const UserController = require('./controllers/UserController')

// router.get('/', (req, res) => {
//     console.log(`params: ${req.url}\nbody: ${req.body}\nquery: ${req.query}`)
//     res.render('index')
// })

router.get('/', (req, res) => {res.render('index')})
router.get('/signIn', (req, res) => res.render('signIn'))

router.post('/user', UserController.create)
router.post('/login', UserController.login)

module.exports = router;