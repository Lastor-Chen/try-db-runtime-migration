// @ts-check
import { DataTypes } from 'sequelize'

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
export default (sequelize) => {
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

  const associate = (model) => {
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
