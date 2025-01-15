import { Sequelize } from 'sequelize'

import { migrator } from '@/umzug/migrations/index.js'
import { createModels } from '@/models/index.js'

export async function initSqlite(filePath: string) {
	const sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: filePath,
		logging: false,
	})

	// test 連線
	await sequelize.authenticate()
	console.log('[SQLite] connection successfully')

	// 建立 models
	const models = createModels(sequelize)

	// 檢查是否為新建的 db
	const { umzug } = await migrator(sequelize)

	return {
		sequelize,
		umzug,
		...models,
	}
}
