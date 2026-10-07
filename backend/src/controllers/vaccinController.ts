import { vaccinService } from '../services/vaccinService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  if(!data.name || data.name.trim().length < 2 ) return 'Définir les vaccins administrés'
  if(data.age_min  && data.age_max && data.age_min >  data.age_max) return 'Erreur au niveau des âges'
  if(!data.age_min  && !data.age_max ) return 'Insérer au moins un âge'
  return null
}

export const vaccinController = createBaseController(vaccinService, {
  create: validateCreate,
  update: validateCreate
})