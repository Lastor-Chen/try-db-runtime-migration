import path from 'node:path'
import Module from 'node:module'

import { Sequelize } from 'sequelize'
import fastGlob from 'fast-glob'

import type { ModelList, AssociateFn, ModelModule } from '@/models/types.js'

const require = Module.createRequire(import.meta.url)

export function createModels(sequelize: Sequelize) {
  const modelList = {} as ModelList
  const associates: AssociateFn[] = []

  const thisFile = path.basename(import.meta.filename)

  fastGlob
    .sync(['*.{ts,js}'], {
      cwd: import.meta.dirname,
      absolute: true,
      ignore: [thisFile, '**/types.ts'],
    })
    .forEach((file) => {
      const { defineModel, associate } = require(file) as ModelModule

      const model = defineModel(sequelize)
      modelList[model.name as keyof ModelList] = model

      associates.push(associate)
    })

  associates.forEach((fn) => fn(modelList))

  return modelList
}
