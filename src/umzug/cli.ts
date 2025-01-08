import path from 'node:path'
import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'

import sortedMigrations from './migrations/registry.js'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), './database.db'),
  logging: false,
})

const umzug = new Umzug({
  migrations: sortedMigrations,
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

umzug.runAsCLI()
