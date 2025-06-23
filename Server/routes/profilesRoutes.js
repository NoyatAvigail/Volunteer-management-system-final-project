import express from 'express';
import profilesController from '../controller/profilesController.js';
import emailController from '../controller/emailController.js';
const router = express.Router();

router.route('/')
    .get(profilesController.getProfile)
    .put(profilesController.updateProfile);

router.route('/patients')
    .get(profilesController.getPatients);

router.route('/patients/:id')
    .put(profilesController.updatePatientProfile)
    
router.post('/send-edit-email', emailController.sendEditEmail);
router.post('/verify-edit-code', emailController.verifyEditCode);


export default router;