import { DataTypes } from 'sequelize'

import type { Sequelize, Optional, ModelDefined } from 'sequelize'
import type { AssociateFn } from '@/models/types.js'

interface CertAttrs {
  id: number
  type: 'tls' | 'smime'
  name: string
}

type CertCreationAttrs = Optional<CertAttrs, 'id'>

export type CertModel = ModelDefined<CertAttrs, CertCreationAttrs>

export const defineModel = (sequelize: Sequelize): CertModel => {
   return sequelize.define('Cert', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['tls', 'smime']],
      },
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'cert',
    timestamps: false,
  })
}

export const associate: AssociateFn = (model) => {
  model.Cert.hasMany(model.User, {
    foreignKey: {
      name: 'tls_id',
      allowNull: true,
    },
    as: 'tlsUsers',
  })
  model.Cert.hasOne(model.User, {
    foreignKey: {
      name: 'smime_id',
      allowNull: true,
    },
    as: 'smimeUser',
  })
}
