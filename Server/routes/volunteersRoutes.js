import express from 'express';
import volunteersController from '../controller/volunteersController.js';
import { verifyToken } from '../middleware/middleware.js';
import userController from '../controller/usersController.js';
const router = express.Router();
router.use(verifyToken);
router.route('/:id/shifts')
    .get(volunteersController.getShifts)
// .post(volunteersController.createShift)
// .put(volunteersController.updateShift)
// .delete(volunteersController.deleteShift);

// router.route('/:id/permanentShifts')
//     .get(volunteersController.getPermanentShifts);

router.route('/:id/requests')
    .get(volunteersController.getOpenRequests);

router.route('/:id/profile')
    .get(volunteersController.getVolunteerProfile)
    .put(volunteersController.updateVolunteerProfile);

router.route('/:id/certificate')
    .get(volunteersController.getCertificate);
router.route('/:type/:userId/:table')
    // .all(validateUserId)
    .get(userController.getAll)

export default router;
