import path from 'node:path'
import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'

import { createModels } from './models/index.js'
import { loadMigrations, syncTables } from './migrations/index.js'

// init sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), './database.db'),
  logging: false,
})

const models = createModels(sequelize)

// init migrator
const migrations = loadMigrations(path.join(import.meta.dirname, './migrations'))
const storage = new SequelizeStorage({ sequelize })
const umzug = new Umzug({
  migrations: migrations,
  context: sequelize.getQueryInterface(),
  storage,
  logger: console,
})

// check db migrations status
const queryInterface = sequelize.getQueryInterface()
const tables = await queryInterface.showAllTables()
const isNewDb = tables.length === 0
if (isNewDb) {
  console.log('[CLI] New db detected, sync tables schema\n')
  await syncTables({ sequelize, umzug })
}

// start cli
await umzug.runAsCLI()
