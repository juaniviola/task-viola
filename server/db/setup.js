'use strict'

require('babel-polyfill')
const inquirer = require('inquirer')
const db = require('./index')
const debug = require('debug')('db:setup')
const config = {
  database: process.env.DATABASE || 'users',
  username: process.env.USERNAME ||'root',
  password: process.env.PASSWORD ||'microsoft',
  host: process.env.HOST ||'localhost',
  dialect: 'mysql',
  logging: s => debug(s),
  setup: true,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  operatorsAliases: false
}

const prompt = inquirer.createPromptModule()

async function setup () {
  if (process.env.SETUP === true || process.env.SETUP === 'true') {
    try {
      await db(config)
    } catch (err) {
      handleFatalError(err)
    }
  }

  console.log('success')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

setup()
