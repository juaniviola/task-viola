'use strict'

import 'babel-polyfill'
import express from 'express'
import jwt from 'jsonwebtoken'
import auth from 'express-jwt'
import Debug from 'debug'
import db from '../db/'
import config from './config'
import {
  hashSync as hash,
  compareSync as comparePasswords } from 'bcryptjs'
import nodemailer from 'nodemailer'
import uuid from 'uuid/v1'

const debug = new Debug('alta:auth')
const app = express.Router()
const secret = config.claves.secret

let services, User, Task
let arrUser = []

app.use('*', async (req, res, next) => {
  if (!services) {
    try {
      services = await db(config.db)
      debug('conecting to db')
    } catch (err) {
      return handleFatalError(err)
    }

    User = services.User
    Task = services.Task
  }

  next()
})

const autho = (req, res, next) => {
  const { token } = req.query

  verifyToken(token, (err, dec) => {
    if (err) {
      return res.status(401).json({
        error: err,
        message: 'No autorizado'
      })
    }

    req.username = dec.user.username

    next()
  })
}

// GET /auth/getusers
// app.get('/getusers', auth(config.claves), async (req, res) => {
//   debug('sending users')

//   let user
//   try {
//     user = await User.findAll()
//   } catch (e) {
//     handleFatalError(e)
//   }

//   res.send(user)
// })

// GET /auth/getuserbyusername/username
app.get('/getuserbyusername/:username', auth(config.claves), async (req, res) => {
  const username = req.params.username

  let user
  try {
    user = await User.findByUsername(username)

    if (!user) {
      return res.status(200).send(user)
    }
  } catch (e) {
    handleFatalError(e)
  }

  res.status(200).json({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })
})

// GET /auth/getuserbyusername/username
/*****************************************
 *                                       *
 *        get username with token        *
 *                                       *
 *****************************************/
app.get('/getuserbyusernamet/:username', auth(config.claves), autho, async (req, res) => {
  const username = req.params.username
  const _username = req.username

  if (username !== _username) {
    return res.status(404).json({
      error: 'Unhauthorized',
      message: 'No autorizado.'
    })
  }

  let user
  try {
    user = await User.findByUsername(username)

    if (!user) {
      return res.status(200).send(user)
    }
  } catch (e) {
    handleFatalError(e)
  }

  res.status(200).json({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })
})

// GET /auth/getuserbyemail/email
app.get('/getuserbyemail/:email', auth(config.claves), async (req, res) => {
  const email = req.params.email

  let user
  try {
    user = await User.findByEmail(email)

    if (!user) {
      return res.status(200).send(user)
    }
  } catch (e) {
    handleFatalError(e)
  }

  res.status(200).json({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })
})

// GET /auth/deleteuser/username
app.post('/deleteuser', auth(config.claves), autho, async (req, res) => {
  const { username, password } = req.body
  const _username = req.username

  if (username !== _username) {
    return res.status(401).json({
      error: 'Invalid operation',
      message: 'Operación invalida'
    })
  }

  try {
    const u = await User.findByUsername(username)

    if (u) {
      if (!comparePasswords(password, u.password)) {
        return res.status(401).json({
          error: 'password incorrect',
          message: 'La contraseña es incorrecta'
        })
      }

      await User.deleteUserByUsername(username)
      await Task.deleteTaskByUsername(username)

      res.status(200).send('success')
    } else {
      res.status(404).json({
        error: 'user not found',
        message: 'El usuario que desea eliminar no existe.'
      })
    }
  } catch (err) {
    handleFatalError(err)
  }

  debug('user deleted')
})

// POST /auth/signin
app.post('/signin', auth(config.claves), async (req, res) => {
  const { username, password } = req.body.user

  let user = null
  try {
    user = await User.findByUsername(username)
  } catch (err) {
    return handleFatalError(err)
  }

  if (!user) {
    return handleLoginFailed(res, 'El nombre usuario no existe.')
  }

  const pass = user.password

  if (!comparePasswords(password, pass)) {
    return handleLoginFailed(res, 'El usuario y la contraseña no coinciden')
  }

  const token = createToken({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })

  res.status(200).json({
    message: 'signin succeded',
    token,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })
})

// POST /auth/signup
app.post('/signup', auth(config.claves), async (req, res) => {
  const { username, firstName, lastName, password, email } = req.body.user

  let token
  let user = {
    username,
    email,
    password: hash(password, 8),
    firstName,
    lastName
  }

  try {
    const u = await User.create(user)
    token = createToken({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })
  } catch (err) {
    handleFatalError(err)
  }

  res.status(200).json({
    message: 'user saved',
    token,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })
})

app.post('/update', auth(config.claves), autho, async (req, res) => {
  const { username, firstName, lastName, email } = req.body.user
  const { password } = req.body

  const user = {
    username,
    email,
    firstName,
    lastName
  }

  const _username = req.username
  const us = await User.findByUsername(_username)

  if (!comparePasswords(password, us.password)) {
    return res.status(401).json({
      error: 'password incorrect',
      message: 'La contraseña es incorrecta'
    })
  }

  let u, token
  try {
    u = await User.updateUser(user, _username)
    const pi = await Task.UpdateUsernameTask(_username, username)
    token = createToken({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })
  } catch (e) {
    handleFatalError(e)
  }

  res.status(200).json({
    message: 'user saved',
    token,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })
})

// POST /auth/password
app.post('/password', auth(config.claves), autho, async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const { username } = req

  const us = await User.findByUsername(username)

  if (!us) {
    return res.status(401).json({
      error: 'user not found',
      message: 'El usuario no existe'
    })
  }

  if (!comparePasswords(oldPassword, us.password)) {
    return res.status(401).json({
      error: 'password incorrect',
      message: 'La contraseña es incorrecta'
    })
  }

  const currentPassword = hash(newPassword, 8)

  const save = await User.updatePassword(username, currentPassword)

  res.status(200).json({
    message: 'success'
  })
})

// POST /auth/recover
app.post('/recover', auth(config.claves), async (req, res) => {
  const { username, email } = req.body

  const us = await User.findByUsername(username)

  if (us) {
    if (!us.username || !(us.username === username && us.email === email)) {
      return res.status(401).json({
        message: 'El usuario y el email no coinciden'
      })
    }
  } else {
    return res.status(401).json({
      message: 'El usuario y el email no coinciden'
    })
  }

  const pepe = arrUser.find(arr => arr.username === username && arr.id)

  if (pepe) {
    return res.status(404).send({
      message: 'Ya se ha enviado el email'
    })
  }

  const id = uuid()
  arrUser.push({
    username,
    id
  })

  setTimeout(() => {
    const pepito = arrUser.find(arr => arr.username === username && arr.id)

    if (pepito.username && pepito.id) {
      debug(`eliminado ${pepito.username}`)
      return arrUser.splice(arrUser.indexOf(pepito), 1)
    }
  }, 900000)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.claves.email,
      pass: config.claves.passwordEmail
    }
  })

  const m = {
    firstName: us.firstName,
    lastName: us.lastName
  }

  const message = {
    from: config.claves.email,
    to: email,
    subject: 'Recuperación de contraseña',
    text: '...',
    html: `
      <h1>hola ${m.firstName} ${m.lastName}</h1>
      <p>Ingresa al link para recuperar la contraseña.</p>
      <a href=\"${config.claves.appLink}/recover/${username}/${id}\">Haz click aquí</a>
    `
  }

  transporter.sendMail(message, (err, info) => {
    if (err) {
      return console.log(err)
    }

    res.status(200).json({
      message: 'success'
    })
  })
})

app.post('/recoverpass', auth(config.claves), async (req, res) => {
  const { id, username, password } = req.body

  const usr = arrUser.find(arr => arr.username === username && arr.id)

  // console.log(`${usr.username} - ${username} // ${usr.id} - ${id}`)

  if (usr) {
    if (usr.username === username && usr.id === id) {
      debug(`us: ${username} - pass: ${password}`)

      const currentPassword = hash(password, 8)

      try {
        const saveUs = await User.updatePassword(username, currentPassword)
        arrUser.splice(arrUser.indexOf(req.usr), 1)
        res.status(201).json({
          message: 'success'
        })
      } catch (err) {
        handleFatalError(err)
      }
    } else {
      return res.status(404).json({
        error: 'unhautorized',
        message: 'La operación no es valida.'
      })
    }
  } else {
    return res.status(404).json({
      error: 'unhautorized',
      message: 'La operación no es valida.'
    })
  }
})

function createToken (user)  {
  return jwt.sign({ user }, secret)
}

function verifyToken (token, callback)  {
  return jwt.verify(token, secret, callback)
}

function handleLoginFailed(res, message) {
  return res.status(401).json({
    message: 'Login failed',
    error: message || 'Email and pass don\'t match'
  })
}

function handleFatalError (err) {
  console.log(err.message)
  console.log(err.stack)
  process.exit(1)
}

export default app
