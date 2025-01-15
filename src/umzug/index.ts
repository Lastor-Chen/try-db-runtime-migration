import path from 'node:path'

import { initSqlite } from '@/umzug/entry.js'

const db = await initSqlite(path.join(process.cwd(), './database.db'))

const users = await db.User.findAll({
  raw: true,
  nest: true,
  include: [
    { model: db.Cert, as: 'smime' },
  ],
})

console.log('users', users)
