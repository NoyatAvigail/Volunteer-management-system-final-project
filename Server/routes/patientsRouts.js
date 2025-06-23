import express, { Router } from 'express';
import patientsController from '../controller/patientsController.js';

const router = express.Router();
router.route('/')
    .get(patientsController.getPatients)
    .post(patientsController.createPatient);

router.route('/:id')
    .put(patientsController.updatePatient)
    .get(patientsController.getPatientById)
    .delete(patientsController.deletePatient);
export default router;