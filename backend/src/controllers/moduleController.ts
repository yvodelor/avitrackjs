import { moduleService } from '../services/moduleService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  if(!data.name || data.name.trim().length < 3 ) return 'Name min 3 caractères'
  return null
}

export const moduleController = createBaseController(moduleService, {
  create: validateCreate,
  update: validateCreate
})