import { farmService } from '../services/farmService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  if(!data.name || data.name.trim().length < 3 ) return 'nom min 3 caractères'
  return null
}

export const farmController = createBaseController(farmService , {
  create: validateCreate,
  update: validateCreate
})
