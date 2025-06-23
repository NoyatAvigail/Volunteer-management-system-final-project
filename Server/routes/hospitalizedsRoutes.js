import express from 'express';
import hospitalizedsController from '../controller/hospitalizedsController.js';
const router = express.Router();

router.route('/')
    .post(hospitalizedsController.createHospitalized);

router.route('/:id')
    .get(hospitalizedsController.getHospitalizeds)
    .post(hospitalizedsController.createHospitalized);

export default router;