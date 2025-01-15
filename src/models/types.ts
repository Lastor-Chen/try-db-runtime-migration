import type { Sequelize, ModelStatic, Model } from 'sequelize'
import type { UserModel } from '@/models/User.js'
import type { CertModel } from '@/models/Cert.js'

export type ModelList = {
  User: UserModel,
  Cert: CertModel,
}

export type AssociateFn = (model: ModelList) => void

export type ModelModule = {
  defineModel(sequelize: Sequelize): ModelStatic<Model>,
  associate: AssociateFn,
}
