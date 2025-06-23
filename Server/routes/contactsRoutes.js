import express from 'express';
import contactController from '../controller/contactsController.js';
const router = express.Router();

router.route('/patients')
    .get(contactController.getPatients)
    .post(contactController.createPatient);

router.route('/patients/:id')
    .get(contactController.getPatientById)
    .put(contactController.updatePatient)
    .delete(contactController.deletePatient);
    
router.route('/hospitalizeds')
    .post(contactController.createHospitalized);
   
router.route('/hospitalizeds/:id')
    .get(contactController.getHospitalizeds)
    .post(contactController.createHospitalized);
    
router.route('/thanks')
    .get(contactController.getThanks)
    .post(contactController.createThanks);

export default router;