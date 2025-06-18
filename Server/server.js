import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import codeTablesRoutes from './routes/codeTablesRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import sequelize from '../DB/connectionDB.mjs';
import volunteersRoutes from './routes/volunteersRouter.js'

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/codetables", codeTablesRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/volunteer",volunteersRoutes)

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