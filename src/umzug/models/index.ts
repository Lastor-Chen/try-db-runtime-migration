import path from 'node:path'
import Module from 'node:module'

import { Sequelize } from 'sequelize'
import fastGlob from 'fast-glob'

import { migrator } from '../migrations/index.js'

import type { ModelList, AssociateFn, ModelModule } from './types.js'

const require = Module.createRequire(import.meta.url)

// TODO 研究一下官方 Typescript 文件
export function createModels(sequelize: Sequelize) {
	const modelList = {} as ModelList
	const associates: AssociateFn[] = []

	const thisFile = path.basename(import.meta.filename)
	fastGlob
		.sync(['*.{ts,js}'], {
			cwd: import.meta.dirname,
			absolute: true,
			ignore: [thisFile, '**/types.ts'],
		})
		.forEach((file) => {
			const { defineModel, associate } = require(file) as ModelModule

			const model = defineModel(sequelize)
			modelList[model.name as keyof ModelList] = model

			associates.push(associate)
		})

	associates.forEach((fn) => fn(modelList))

	return modelList
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
	const { umzug } = await migrator(sequelize)

	return {
		sequelize,
		umzug,
		...models,
	}
}
