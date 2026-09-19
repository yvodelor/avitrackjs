import { typeAlertService } from '../services/typeAlertService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  
  return null
}

export const typeAlertController = createBaseController(typeAlertService, {
  create: validateCreate,
  update: validateCreate
})