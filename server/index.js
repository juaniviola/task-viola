'use strict'

import app from './app'
import Debug from 'debug'

const debug = new Debug('alta:app')
const port = process.env.PORT || 3000

app.listen(port, () => {
  debug(`app corriendo en puerto ${port}`)
})

require('babel-polyfill')
