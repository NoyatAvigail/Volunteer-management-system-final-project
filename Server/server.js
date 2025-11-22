import express from 'express';
import cors from 'cors';
import connectionDB from '../DB/connectionDB.mjs';
import userRoutes from './routes/usersRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import referenceDataRoutes from './routes/referenceDataRoutes.js';
import requestRoutes from './routes/requestsRoutes.js';
import volunteersRoutes from './routes/volunteersRoutes.js';
import contactsRoutes from './routes/contactsRoutes.js';
import patientsRouts from './routes/patientsRouts.js'
import hospitalizedsRoutes from './routes/hospitalizedsRoutes.js'
import profilesRoutes from './routes/profilesRoutes.js';
import thanksRoutes from './routes/thanksRoutes.js';
import { verifyToken } from './middleware/middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/referenceData", referenceDataRoutes);
app.use(verifyToken);
app.use("/api/requests", requestRoutes);
app.use("/api/volunteers", volunteersRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/patients", patientsRouts);
app.use("/api/profiles", profilesRoutes);
app.use("/api/thanks", thanksRoutes);
app.use("/api/hospitalizeds", hospitalizedsRoutes);

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