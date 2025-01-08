import { DataTypes } from 'sequelize'
import dedent from 'dedent'

import type { MigrationFn } from 'umzug'
import type { QueryInterface } from 'sequelize'

export const up: MigrationFn<QueryInterface> = async ({ context: queryInterface }) => {
  // sequelize 規格上要求外鍵必須要有 ON DELETE 與 ON UPDATE, 用刪除重建的方式遷移

  // 讀出舊 token table schema
  const tokenTable = await queryInterface.describeTable('user')

  // 從舊 schema 建立新表, 加入要修改的設定
  await queryInterface.createTable('user_new', {
    ...tokenTable,
    tls_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cert',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    smime_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cert',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  })

  // 從舊表倒入資料到新表
  await queryInterface.sequelize.query(`
    INSERT INTO user_new SELECT * from user
  `)

  // 移除舊表
  await queryInterface.dropTable('user')

  // 更名新表
  await queryInterface.renameTable('user_new', 'user')
}

export const down: MigrationFn<QueryInterface> = async ({ context: queryInterface }) => {
  // create the previous original table with different name
  queryInterface.sequelize.query(dedent`
    CREATE TABLE user_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tls_id INTEGER,
      smime_id INTEGER,
      FOREIGN KEY (tls_id) REFERENCES cert (id),
      FOREIGN KEY (smime_id) REFERENCES cert (id)
    );
  `)

  // 從舊表倒入資料到新表
  await queryInterface.sequelize.query(`
    INSERT INTO user_new SELECT * from user
  `)

  // 移除舊表
  await queryInterface.dropTable('user')

  // 更名新表
  await queryInterface.renameTable('user_new', 'user')
}
