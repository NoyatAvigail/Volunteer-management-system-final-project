import app from './app.js';
import './Models/index.js'; 
import sequelize from '../DB/db.mjs';

const start = async () => {
    try {
        await sequelize.sync({ force: true });
        app.listen(5000, () => console.log('Server is running on port 5000'));
    } catch (err) {
        console.error('Error starting the server:', err);
    }
};

start()