import { interventionService } from '../services/interventionService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  
  return null
}

export const interventionController = createBaseController(interventionService, {
  create: validateCreate,
  update: validateCreate
})