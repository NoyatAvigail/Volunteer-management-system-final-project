import sequelize from './connectionDB.mjs';
import { seedStaticTables } from './seedStaticTables.mjs';
import './index.mjs'; 

export async function initDB() {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');
    await seedStaticTables();
  } catch (error) {
    console.error('Failed to sync database:', error);
    throw error;
  }
};

export default initDB;