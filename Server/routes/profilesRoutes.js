import express from 'express';
import profilesController from '../controller/profilesController.js';
import { verifyToken } from '../middleware/middleware.js';

const router = express.Router();
router.use(verifyToken);

router.route('/')
    .get(profilesController.getProfile)
    .put(profilesController.updateProfile);

router.route('/patients')
    .get(profilesController.getPatients);

router.route('/patients/:id')
    .put(profilesController.updatePatientProfile)
    .delete(contactController.deletePatient);

export default router;