import { capteurService } from '../services/capteurService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  if(!data.name || data.name.trim().length < 3 ) return 'Name min 3 caractères'
  return null
}

export const capteurController = createBaseController(capteurService, {
  create: validateCreate,
  update: validateCreate
})