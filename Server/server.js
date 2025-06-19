import express from 'express';
import cors from 'cors';
import userRoutes from './routes/usersRoutes.js';
import codeTablesRoutes from './routes/codeTablesRoutes.js';
import requestRoutes from './routes/requestsRoutes.js';
import sequelize from '../DB/connectionDB.mjs';
import volunteersRoutes from './routes/volunteersRoutes.js'
import contactRoutes from './routes/contactsRoutes.js'
import profilesRoutes from './routes/profilesRoutes.js'

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/codetables", codeTablesRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/volunteers",volunteersRoutes)
app.use("/api/contacts",contactRoutes)
app.use("/api/profiles",profilesRoutes)

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