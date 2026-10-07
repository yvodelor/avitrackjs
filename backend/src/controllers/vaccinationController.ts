import { vaccinationService } from '../services/vaccinationService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  if(!data.vaccins || data.vaccins.trim().length < 2 ) return 'Définir les vaccin administrés'
  if(!data.date) return 'Ajouter la date'

  return null
}

export const vaccinationController = createBaseController(vaccinationService, {
  create: validateCreate,
  update: validateCreate
})