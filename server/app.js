'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import auth from './routes/auth'
import task from './routes/task'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS')

    next()
  })
}

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS')

    next()
  })

  app.use(express.static(path.join(process.cwd(), './dist')))
}

app.use('/api/auth', auth)
app.use('/api/task', task)

app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

export default app
