import express from 'express';
import profilesController from '../controller/profilesController.js';
import { verifyToken } from '../middleware/middleware.js';
import usersController from '../controller/usersController.js'
const router = express.Router();
router.use(verifyToken);

router.route('/')
    .get(profilesController.getProfile)
    .put(profilesController.updateProfile);

router.route('/patients')
    .get(profilesController.getPatients);

router.route('/patients/:id')
    .put(profilesController.updatePatientProfile)
    
router.post('/send-edit-email', usersController.sendEditEmail);
router.post('/verify-edit-code', usersController.verifyEditCode);

export default router;