import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import genericRoutes from './routes/genericRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", userRoutes);
app.use("/", genericRoutes);

export default app;