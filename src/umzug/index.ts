import path from 'node:path'

import { initSqlite } from './models/index.js'

const db = await initSqlite(path.join(process.cwd(), './database.db'))

console.log('finish')
