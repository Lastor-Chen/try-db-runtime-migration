import { DataTypes } from 'sequelize'

import type { Sequelize } from 'sequelize'
import type { AssociateFn } from './types.js'

export const defineModel = (sequelize: Sequelize) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'user',
    timestamps: false,
  })
}

export const associate: AssociateFn = (model) => {
  model.User.belongsTo(model.Cert, { foreignKey: 'tls_id', as: 'tls' })
  model.User.belongsTo(model.Cert, { foreignKey: 'smime_id', as: 'smime' })
}
