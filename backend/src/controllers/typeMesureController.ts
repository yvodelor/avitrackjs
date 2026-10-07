import { typeMesureService } from '../services/typeMesureService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  
  return null
}

export const typeMesureController = createBaseController(typeMesureService, {
  create: validateCreate,
  update: validateCreate
})