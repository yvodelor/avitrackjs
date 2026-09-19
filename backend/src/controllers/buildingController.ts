import { buildingService } from '../services/buildingService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  if(!data.name || data.name.trim().length < 3 ) return 'Name min 3 caractères'
  return null
}

export const buildingController = createBaseController(buildingService, {
  create: validateCreate,
  update: validateCreate
})