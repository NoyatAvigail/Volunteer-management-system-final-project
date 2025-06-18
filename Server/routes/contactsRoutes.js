import express from 'express';
import contactController from '../controller/contactsController.js';
import { verifyToken } from '../middleware/middleware.js';

const router = express.Router();
router.use(verifyToken);

router.route('/:id/home')
    .get(contactController.getHome);

router.route('/:id/requests')
    .get(contactController.getMyRequests)
    .post(contactController.createRequest);

router.route('/:id/profile')
    .get(contactController.getProfile)
    .put(contactController.updateProfile);

router.route('/:id/thanks')
    .get(contactController.getThanks);

router.route('/:contactPersonId/patients')
    .post(contactController.addPatient)           
    .get(contactController.getAllPatients);

router.route('/:contactPersonId/patients/:patientUserId')
    .get(contactController.getPatientByUserId)
    .put(contactController.updatePatientProfile)    
    .delete(contactController.deletePatient);  
export default router;