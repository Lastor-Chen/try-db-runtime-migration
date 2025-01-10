import type { Sequelize, ModelStatic, Model } from 'sequelize'

export type ModelList = {
  User: ModelStatic<Model>,
  Cert: ModelStatic<Model>,
}

export type AssociateFn = (model: Record<keyof ModelList, ModelStatic<Model>>) => void

export type ModelModule = {
  defineModel(sequelize: Sequelize): ModelStatic<Model>,
  associate: AssociateFn,
}
