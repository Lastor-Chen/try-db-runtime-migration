import path from 'node:path'

import { initSqlite } from '@/manual/entry.js'

const db = await initSqlite(path.join(process.cwd(), './database.db'))

const users = await db.User.findAll({
  include: [
    { model: db.Cert, as: 'smime' },
  ],
})

console.log('users', users.map((user) => user.toJSON()))
