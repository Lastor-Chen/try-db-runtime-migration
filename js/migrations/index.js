//@ts-check
import { DataTypes } from 'sequelize'
import semver from 'semver'

import { migrations } from './config.js'

const VER_STAMP_NAME = '__version__'

/**
 * @typedef {import('sequelize').QueryInterface} QueryInterface
 */

// 按小到大排序, 轉成 array 格式
const sortedMigrations = Object.keys(migrations)
	.sort((a, b) => semver.gt(a, b) ? 1 : -1)
	.map((ver) => ({ ver, migrateFn: migrations[ver] }))

/**
 * @param {QueryInterface} queryInterface
 * @param {{ isMigration: boolean }} [options] true 表示從舊的 sqlite3 版本遷移, 要補打 version stamp
 */
export async function getOrCreateVerStamp(queryInterface, options) {
	const hasVer = await queryInterface.tableExists(VER_STAMP_NAME)
	if (hasVer) {
		const [versionRows] =
			/** @type {{ ver: string }[][]} */
			(await queryInterface.sequelize.query(`SELECT ver FROM ${VER_STAMP_NAME};`))

		return versionRows[0].ver
	} else {
		const { isMigration } = options || {}

		const initVer = '0.0.0'
		const verStamp = isMigration ? initVer : (sortedMigrations.at(-1)?.ver || initVer)
		console.log('[SQLite] create version stamp', verStamp)

		await queryInterface.createTable(VER_STAMP_NAME, {
			ver: { type: DataTypes.TEXT, allowNull: false },
		})
		await queryInterface.bulkInsert(VER_STAMP_NAME, [{ ver: verStamp }])

		return verStamp
	}
}

/**
 * @param {QueryInterface} queryInterface
 */
export const migrator = async (queryInterface) => {
  // 取得 db 版號
	const dbVer = await getOrCreateVerStamp(queryInterface, { isMigration: true })
	console.log('[SQLite] current db ver:', dbVer)

	// db 版號較舊才執行
	const latestVer = sortedMigrations.at(-1)?.ver
	console.log('[SQLite] latest db ver:', latestVer)
	if (!latestVer || semver.gte(dbVer, latestVer)) return

	// 批次執行 migrations
	for (const { ver, migrateFn } of sortedMigrations) {
		if (semver.lte(ver, dbVer)) continue

		console.log(`[SQLite] up to ${ver}`)
		await migrateFn(queryInterface)

		// 更新 ver stamp
		await queryInterface.bulkUpdate(VER_STAMP_NAME, { ver: ver }, {})
	}

	console.log('[SQLite] Successfully migrated to version', latestVer)
}
