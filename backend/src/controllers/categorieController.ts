import { categorieService } from '../services/categorieService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  if(!data.name || data.name.trim().length < 3 ) return 'Name min 3 caractères'
  return null
}

export const categorieController = createBaseController(categorieService, {
  create: validateCreate,
  update: validateCreate
})