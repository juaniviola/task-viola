'use strict'

const db = require('../')
const debug = require('debug')('db:ex')
const config = {
  database: 'users',
  username: 'root',
  password: 'microsoft',
  host: 'localhost',
  dialect: 'mysql',
  logging: s => debug(s),
  setup: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  operatorsAliases: false
}

async function run () {
  const { User, Task } = await db(config).catch(handleFatalError)

  // const user = await User.create({
  //   username: 'momi',
  //   firstName: 'juansadi',
  //   lastName: 'violsa',
  //   password: 'mami',
  //   email: 'jaja@hosdt.com',
  //   age: 12
  // }).catch(handleFatalError)

  // const user2 = await User.create({
  //   username: 'pipa',
  //   firstName: 'jajaja',
  //   lastName: 'jeje',
  //   email: 'culo@mierda.com',
  //   password: 'mierda',
  //   age: 13
  // }).catch(handleFatalError)

  // const users = await User.findAll().catch(handleFatalError)

  // console.log('--user--')
  // console.log(users)

  // await User.deleteUser('pipa').catch(handleFatalError)

  // const u = await User.findAll().catch(handleFatalError)

  // console.log('--users--')
  // console.log(u)

  const t = await Task.create({
    name: 'tarea',
    description: 'Tarea de filosofia',
    username: 'garcha',
    uuid: '12345'
  }).catch(handleFatalError)

  const ta = await Task.create({
    name: 'jajajeje',
    description: 'hacer mierda',
    username: 'garompa',
    uuid: '12379'
  }).catch(handleFatalError)

  const task = await Task.getTasks().catch(handleFatalError)

  console.log('--tasks--')
  console.log(task)

  // const jeje = await Task.deleteTask('asd12345').catch(handleFatalError)
  // const jas = await Task.getTasksByUsername('pipa').catch(handleFatalError)
}

function handleFatalError (err) {
  console.log(err.message)
  console.log(err.stack)
  process.exit(1)
}

run()
