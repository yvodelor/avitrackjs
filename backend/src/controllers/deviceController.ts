import { deviceService } from '../services/deviceService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  return null
}

export const deviceController = createBaseController(deviceService, {
  create: validateCreate,
  update: validateCreate
})

