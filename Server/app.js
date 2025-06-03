import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import genericRoutes from './routes/genericRoutes.js';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use("/", userRoutes);
app.use("/", genericRoutes);

export default app;