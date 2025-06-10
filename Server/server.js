
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import genericRoutes from './routes/genericRoutes.js';
import sequelize from '../DB/connectionDB.mjs';
import { swaggerUi, specs } from './swagger.js';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/", userRoutes);
app.use("/", genericRoutes);

const start = async () => {
  try {
    await sequelize.authenticate(); 
    console.log('Connected to DB');
    app.listen(5000, () => console.log('Server is running on port 5000'));
  } catch (err) {
    console.error('Error starting the server:', err);
  }
};

start();