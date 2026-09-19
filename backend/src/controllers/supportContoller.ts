import { supportService } from '../services/supportService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  
  return null
}

export const supportController = createBaseController(supportService, {
  create: validateCreate,
  update: validateCreate
})