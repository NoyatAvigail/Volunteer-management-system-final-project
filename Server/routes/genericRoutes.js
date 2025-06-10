import express from 'express';
import genericController from '../controller/genericConterller.js';
import { verifyToken, validateUserId } from '../middleware/middleware.js';
import { swaggerUi } from '../swagger.js';
const router = express.Router();
router.use(verifyToken);

// server/routes/volunteers.js

/**
 * @swagger
 * /volunteers:
 *   get:
 *     summary: Get all volunteers
 *     responses:
 *       200:
 *         description: A list of volunteers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 */
router.get("/volunteers", (req, res) => {
    // ...
});

router.route('/:type/:userId/:table')
    .all(validateUserId)
    .get(genericController.getAllOrByValue)
    .post(genericController.post);

router.route('/:type/:userId/:baseTable/:id/:table')
    .all(validateUserId)
    .get(genericController.getNested)
    .post(genericController.post)
    .patch(genericController.update)
    .delete(genericController.softDelete);

router.route('/:type/:userId/:table/:id')
    .all(validateUserId)
    .patch(genericController.update)
    .delete(genericController.softDelete);

export default router;