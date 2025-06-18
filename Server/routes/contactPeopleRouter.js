import express from 'express';
import contactController from '../controller/contactController.js';
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

// ניהול פציינטים
router.route('/:contactPersonId/patients')
    .post(contactController.addPatient)             // יצירת פציינט חדש
    .get(contactController.getAllPatients);         // כל הפציינטים של איש הקשר

router.route('/:contactPersonId/patients/:patientUserId')
    .get(contactController.getPatientByUserId)      // שליפת פציינט מסוים לפי userId
    .put(contactController.updatePatientProfile)    // עדכון פרופיל
    .delete(contactController.deletePatient);       // מחיקה לוגית

export default router;