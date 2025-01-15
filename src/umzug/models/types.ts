import type { Sequelize, ModelStatic, Model, ModelDefined } from 'sequelize'
import type { UserModel } from './User.js'
import type { CertModel } from './Cert.js'

export type ModelList = {
  User: UserModel,
  Cert: CertModel,
}

export type AssociateFn = (model: ModelList) => void

export type ModelModule = {
  defineModel(sequelize: Sequelize): ModelStatic<Model>,
  associate: AssociateFn,
}
