import { DataTypes } from 'sequelize'

import type { Sequelize, Optional, ModelDefined } from 'sequelize'
import type { AssociateFn } from './types.js'

interface UserAttrs {
  id: number
  name: string
}

type UserCreationAttrs = Optional<UserAttrs, 'id'>

export type UserModel = ModelDefined<UserAttrs, UserCreationAttrs>

export const defineModel = (sequelize: Sequelize): UserModel => {
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
  model.User.belongsTo(model.Cert, {
    foreignKey: 'tls_id',
    as: 'tls',
  })
  model.User.belongsTo(model.Cert, {
    foreignKey: 'smime_id',
    as: 'smime',
  })
}
