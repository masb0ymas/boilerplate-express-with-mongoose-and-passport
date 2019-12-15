import express from 'express'
import { Router as UnoRouter } from 'uno-api'
import { wrapperRequest } from '../helper'

const router = express.Router()
const apiRouter = new UnoRouter(router)

// Modules
const RoleController = require('../modules/Role/role.controller')
const UserController = require('../modules/User/user.controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

// Authentication
apiRouter.create({
  baseURL: '/auth',
  postWithParam: [
    ['signup', UserController.signUp],
    ['signin', UserController.signIn],
  ],
  wrapperRequest,
})

// User
apiRouter.create({
  baseURL: '/user',
  get: UserController.getAll,
  getWithParam: [[':id', UserController.getOne]],
  wrapperRequest,
})

// Master Role
apiRouter.create({
  baseURL: '/role',
  get: RoleController.getAll,
  getWithParam: [[':id', RoleController.getOne]],
  wrapperRequest,
})

module.exports = router
