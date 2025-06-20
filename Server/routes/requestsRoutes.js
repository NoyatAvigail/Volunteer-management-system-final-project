import express from 'express';
import requestsController from '../controller/requestsController.js';
import { verifyToken, validateUserId } from '../middleware/middleware.js';

const router = express.Router();
router.use(verifyToken);

router.route('/')
    .get(requestsController.getRequests)
    .post(requestsController.createRequests);
    
router.route('/:id')
    .delete(requestsController.deleteRequests)
    .put(requestsController.updatRequests)

export default router;