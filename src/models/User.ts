import { DataTypes } from 'sequelize'

import type { Sequelize, ModelStatic, Model } from 'sequelize'

export default (sequelize: Sequelize) => {
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

  const associate = (model: Record<string, ModelStatic<Model>>) => {
		User.belongsTo(model.Cert, { foreignKey: 'tls_id', as: 'tls' })
    User.belongsTo(model.Cert, { foreignKey: 'smime_id', as: 'smime' })
	}

  return { model: User, associate }
}
