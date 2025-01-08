import { Sequelize } from 'sequelize'

import { migrator } from '../migrations/index.js'

import createCertModel from './Cert.js'
import createUserModel from './User.js'

export function createModels(sequelize: Sequelize) {
	const certModel = createCertModel(sequelize)
	const userModel = createUserModel(sequelize)

	const db = {
		Cert: certModel.model,
		User: userModel.model,
	}

	certModel?.associate(db)
	userModel?.associate(db)

	return db
}

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
	const { syncTables } = await migrator(sequelize)

	return {
		sequelize,
		syncTables,
		...models,
	}
}
