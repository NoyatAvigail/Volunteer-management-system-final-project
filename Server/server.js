import express from 'express';
import sequelize from '../DB/db.mjs';
import './models/index.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const start = async () => {
    try {
        await sequelize.sync();
        app.listen(5000, () => console.log('Server running on port 5000'));
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

start();