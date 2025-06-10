import express from 'express';
import genericController from '../controller/genericConterller.js';
import { swaggerUi } from '../swagger.js';
const router = express.Router();

router.route('/:table')
    .get(genericController.getAll)

export default router;
// import express from 'express';
// import genericController from '../controller/genericConterller.js';
// const router = express.Router();

// router.route('/Sectors')
//     .get(genericController.getAll)
// router.route('/Genders')
//     .get(genericController.getAll)
// router.route('/Hospitals')
//     .get(genericController.getAll)
// router.route('/Departments')
//     .get(genericController.getAll)
// router.route('/FamilyRelations')
//     .get(genericController.getAll)
// router.route('/VolunteeringTypes')
//     .get(genericController.getAll)

// export default router;