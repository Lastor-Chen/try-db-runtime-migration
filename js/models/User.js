// @ts-check
import { DataTypes } from 'sequelize'

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
export default (sequelize) => {
  const User = sequelize.define('User', {
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

  const associate = (model) => {
		User.belongsTo(model.Cert, { foreignKey: 'tls_id', as: 'tls' })
    User.belongsTo(model.Cert, { foreignKey: 'smime_id', as: 'smime' })
	}

  return { model: User, associate }
}
