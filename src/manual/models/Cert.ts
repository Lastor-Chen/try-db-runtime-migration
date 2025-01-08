import { DataTypes } from 'sequelize'

import type { Sequelize, ModelStatic, Model } from 'sequelize'

export default (sequelize: Sequelize) => {
  const Cert = sequelize.define('Cert', {
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

  const associate = (model: Record<string, ModelStatic<Model>>) => {
		Cert.hasMany(model.User, {
      foreignKey: {
        name: 'tls_id',
        allowNull: true,
      },
      as: 'tlsUsers',
    })
    Cert.hasOne(model.User, {
      foreignKey: {
        name: 'smime_id',
        allowNull: true,
      },
      as: 'smimeUser',
    })
	}

  return { model: Cert, associate }
}
