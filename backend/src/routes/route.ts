import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { roleMiddleware } from '../middleware/roleMiddleware'

import alertRoute from './alertRoute'
import buildingRoute from './buildingRoute'
import capteurRoute from './capteurRoute'

import categorieRoute from './categorieRoute'
import deviceRoute from './deviceRoute'
import farmRoute from './farmRoute'
import soucheRoute from './soucheRoute'

import messageAlertRoute from './messageAlertRoute'
import moduleRoute from './moduleRoute'
import paysRoute from './paysRoute'
import vaccinationRoute from './vaccinationRoute'
import vaccinRoute from './vaccinRoute'
import villeRoute from './villeRoute'

import typeAlertRoute from './typeAlertRoute'
import typeMesureRoute from './typeMesureRoute'
import supportRoute from './supportRoute'
import interventionRoute from './interventionRoute'

import { mesureController } from '../controllers/mesureController'
import { alertController } from '../controllers/alertController'

const router = Router()

router.get(
  "/mesures/device/:deviceCode",
  mesureController.getByDevice
);

router.post(
  "/alert/messages",
  alertController.getAlertMessages
);


router.use('/pays', paysRoute )
router.use('/ville', villeRoute )
router.use('/alert', alertRoute )

router.use('/souche', soucheRoute )
router.use('/vaccin', vaccinRoute )
router.use('/categorie', categorieRoute)
router.use('/module', moduleRoute)
router.use('/capteur', capteurRoute)
router.use('/messageAlert', messageAlertRoute)
router.use('/type-alert', typeAlertRoute)
router.use('/type-mesure', typeMesureRoute)


router.use('/support', supportRoute)
router.use('/intervention', interventionRoute)

router.use(authMiddleware)
// Route Privée

router.use('/vaccination', vaccinationRoute)
router.use('/vaccin', vaccinRoute)
router.use('/farm', farmRoute)
router.use('/device', deviceRoute)
router.use('/building', buildingRoute)



//router.use('/dashboard', dashRoute)


// Route admin
//router.use('/intent', roleMiddleware(4), intentRoute, )

export default router;