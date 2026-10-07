import { messageAlertService } from '../services/messageAlertService'

import { createBaseController } from './baseController'

const validateCreate = (data: any) => {
  if(data.age_min  && data.age_max && data.age_min >  data.age_max) return 'Erreur au niveau des âges'
  if(data.val_min  && data.val_max && data.valmin >  data.val_max) return 'Erreur au niveau des valeurs'
  if(!data.val_min  && !data.val_max ) return 'Insérer au moins une valeur'
  if(!data.age_min  && !data.age_max ) return 'Insérer au moins un âge'
  return null
}

export const messageAlertController = createBaseController(messageAlertService, {
  create: validateCreate,
  update: validateCreate
})