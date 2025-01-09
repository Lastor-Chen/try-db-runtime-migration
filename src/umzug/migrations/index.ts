import fs from 'node:fs'
import path from 'node:path'
import Module from 'node:module'

import { SequelizeStorage, Umzug } from 'umzug'
import semver from 'semver'

import type { Sequelize, QueryInterface } from 'sequelize'
import type { MigrationFn, RunnableMigration } from 'umzug'

const require = Module.createRequire(import.meta.url)

export function loadMigrations(dir: string) {
  return fs.readdirSync(dir)
    .filter((file) => (
      !!semver.valid(path.parse(file).name)
    ))
    .sort((a, b) => (
      semver.gt(path.parse(a).name, path.parse(b).name) ? 1 : -1
    ))
    .map<RunnableMigration<QueryInterface>>((file) => {
      const fullPath = path.join(dir, file)
      const module = require(fullPath) as { up: MigrationFn, down: MigrationFn }
  
      return {
        name: path.parse(file).name,
        ...module,
      }
    })
}

/** Sync tables by sequelize models and insert migration stamps to newest */
export async function syncTables(options: {
  sequelize: Sequelize,
  umzug: Umzug<QueryInterface>,
}) {
  const { sequelize, umzug } = options
  const storage = umzug.options.storage as SequelizeStorage

  // create table if not exists
  await sequelize.sync()

  // insert migration stamps
  const pendingMigrations = await umzug.pending()
  await Promise.all(
    pendingMigrations.map(({ name }) => storage!.logMigration({ name }))
  )
}

export const migrator = async (sequelize: Sequelize) => {
  const sortedMigrations = loadMigrations(import.meta.dirname)

  // manage the table of migration history
  const storage = new SequelizeStorage({ sequelize })
  
  const queryInterface = sequelize.getQueryInterface()
  const umzug = new Umzug({
    migrations: sortedMigrations,
    context: queryInterface,
    storage,
    logger: console,
  })

  // 檢查是否為新建的 db
  const tables = await queryInterface.showAllTables()
  const isNewDb = tables.length === 0

  if (isNewDb) {
    console.log('[SQLite] create new tables')
    await syncTables({ sequelize, umzug })
  } else {
    console.log('[SQLite] check migrations')

    const executedMigrations = await storage.executed()
    const dbVer = executedMigrations.at(-1) || 'v0.0.0'
    const appVer = sortedMigrations.at(-1)?.name || 'v0.0.0'
    if (semver.lte(dbVer, appVer)) {
      await umzug.up()
    } else {
      console.log('[SQLite] the database migration record is newer than the app')
			console.log({ dbVer, appVer })
    }
  }

  return { umzug }
}
