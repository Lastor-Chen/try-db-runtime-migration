// @ts-check
import path from 'node:path'

import { initSqlite } from './models/index.js'

const db = await initSqlite(path.join(import.meta.dirname, './database.db'))

const users = await db.User.findAll({
  attributes: { exclude: ['digest'] },
  include: [
    { model: db.Cert, as: 'smime' },
  ],
})
console.log('users', users.map((user) => user.toJSON()))
