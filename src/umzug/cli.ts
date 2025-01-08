import path from 'node:path'
import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'

import { loadMigrations } from './migrations/index.js'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), './database.db'),
  logging: false,
})

const migrations = loadMigrations(path.join(import.meta.dirname, './migrations'))

const umzug = new Umzug({
  migrations: migrations,
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

umzug.runAsCLI()
