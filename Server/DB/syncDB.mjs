import { initDB } from './initDB.mjs';

try {
    await initDB();
    console.log('Database initialized');
    process.exit(0);
} catch (err) {
    console.error('Failed to initialize DB:', err);
    process.exit(1);
};