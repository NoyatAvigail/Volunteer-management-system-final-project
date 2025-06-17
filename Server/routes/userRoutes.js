import express from 'express';
import userController from '../controller/userController.js';
import { verifyToken, validateUserId } from '../middleware/middleware.js';

const router = express.Router();

router.route('/login')
    .post(userController.login);
router.route('/signup')
    .post(userController.signup);

router.use(verifyToken);

router.route('/:type/:userId/:entityName/:id')
    .put(userController.updateProfile)
    .patch(userController.updateProfile);


router.route('/:type/:userId/profile')
    .get(userController.getProfile)
    .put(userController.updateProfile);
router.route('/:ContactPerson/:contactId/type')
    .get(userController.getPatientsByContact);


router.route('/send-edit-email/:id')
    .post(userController.sendEditEmail);
router.post('/verify-edit-code', userController.verifyEditCode);


router.route('/:type/:userId/:table')
    // .all(validateUserId)
    .get(userController.getAll)
    .post(userController.post);

router.route('/:type/:userId/:table/:id')
    .all(validateUserId)
    .delete(userController.softDelete);

router.route('/:type/:userId/join-foreign/:table1/:foreignKey/:table2/:targetKey/:targetField')
    .all(validateUserId)
    .get(userController.getByForeignJoin);

router.route('/profile/:userId')
    .get(userController.getProfile)
    .put(userController.updateProfile);
router.post('/send-edit-email/:id/', userController.sendEditEmail);

router.post('/verify-edit-code', userController.verifyEditCode);

export default router;