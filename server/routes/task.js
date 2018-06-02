'use strict'

import 'babel-polyfill'
import express from 'express'
import jwt from 'jsonwebtoken'
import auth from 'express-jwt'
import Debug from 'debug'
import db from '../db/'
import config from './config'
import uuid from 'uuid/v1'

const debug = new Debug('alta:task')
const app = express.Router()
const secret = config.claves.secret

let services, User, Task

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

const autho = async (req, res, next) => {
  const { token } = req.query

  verifyToken(token, secret, async (err, dec) => {
    if (err) {
      return res.status(401).json({
        error: err,
        message: 'No autorizado'
      })
    }

    let us
    try {
      us = await User.findByUsername(dec.user.username)
    } catch (err) {
      handleFatalError(err)
    }

    if (!us) {
      return res.status(500).json({
        error: 'User not found',
        message: 'El usuario no existe.'
      })
    }

    req.username = dec.user.username

    next()
  })
}

app.get('/:uuid', auth(config.claves), async (req, res) => {
  const { uuid } = req.params

  let t = null
  try {
    t = await Task.getTasksByUuid(uuid)
    if (!t) {
      return res.status(404).json({
        error: 'task not found',
        message: 'La tarea no existe.'
      })
    }
  } catch (err) {
    handleFatalError(err)
  }

  res.status(200).send(t)
})

app.get('/get/:username', auth(config.claves), autho, async (req, res) => {
  const { username } = req.params
  const _username = req.username

  try {
    if (username !== _username) {
      return res.status(401).json({
        error: 'no autorizado...',
        message: 'No estas autorizado'
      })
    }

    const t = await Task.getTasksByUsername(username)
    res.status(200).send(t)
  } catch (err) {
    handleFatalError(err)
  }
})

app.post('/add', auth(config.claves), autho, async (req, res) => {
  const { name, description } = req.body.task
  const _username = req.body.task.username
  const { username } = req

  if (username !== _username) {
    return res.status(401).json({
      error: 'Not found',
      message: 'Task not found'
    })
  }

  const id = uuid()

  try {
    const saveT = await Task.create({ name, description, uuid: id, username, createdAt: new Date() })

    res.status(200).json({
      task: saveT
    })
  } catch (err) {
    handleFatalError(err)
  }

})

app.post('/delete', auth(config.claves), autho, async (req, res) => {
  const { uuid } = req.body

  const { username } = req

  const task = await Task.getTasksByUuid(uuid)

  if (task) {
    if (username !== task.username) {
      return res.status(404).json({
        error: 'Invalid operation',
        message: 'Operación invalida'
      })
    }

    const deleteT = await Task.deleteTask(uuid)
    res.status(201).json({
      message: 'success'
    })
  } else {
    res.status(404).json({
      error: 'Task not found',
      message: 'La tarea que desea eliminar no se encuentra.'
    })
  }
})

app.post('/update', auth(config.claves), autho, async (req, res) => {
  const { task } = req.body
  const { username } = req

  const t = await Task.getTasksByUuid(task.uuid)

  if (t && (username === t.username)) {
    const upT = await Task.updateTask(task)
    res.status(201).send('success')
  } else {
    res.status(404).json({
      error: 'Task not found',
      message: 'La tarea no se encuentra.'
    })
  }
})

function verifyToken (token, secret, callback) {
  jwt.verify(token, secret, callback)
}

function handleFatalError (err) {
  console.log(err.message)
  console.log(err.stack)
  process.exit(1)
}

export default app
