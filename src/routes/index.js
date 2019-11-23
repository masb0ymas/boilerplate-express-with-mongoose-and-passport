import express from 'express'
import passport from 'passport'

let router = express.Router()
require('../config/passport')(passport)

// Modules
const RoleController = require('../modules/Role/role.controller')
const UserController = require('../modules/User/user.controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

// Auth
router.post('/auth/signup', UserController.signUp)
router.post('/auth/signin', UserController.signIn)
router.put(
  '/auth/change-password/:id',
  passport.authenticate('jwt', { session: false }),
  UserController.changePass
)
router.get('/profile', passport.authenticate('jwt', { session: false }), UserController.getProfile)
// User
router.get('/user', UserController.getAll)
router.get('/user/:id', UserController.getOne)
router.post('/user', passport.authenticate('jwt', { session: false }), UserController.storeData)
router.put('/user/:id', passport.authenticate('jwt', { session: false }), UserController.updateData)
router.delete(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  UserController.destroyData
)
// Role
router.get('/role', RoleController.getAll)
router.get('/role/:id', RoleController.getOne)
router.post('/role', passport.authenticate('jwt', { session: false }), RoleController.storeData)
router.put('/role/:id', passport.authenticate('jwt', { session: false }), RoleController.updateData)
router.delete(
  '/role/:id',
  passport.authenticate('jwt', { session: false }),
  RoleController.destroyData
)

module.exports = router
