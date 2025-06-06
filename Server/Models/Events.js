import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const Events = sequelize.define('Events', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    patientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Patients", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    contactId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "ContactPeople", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    volunteerId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    hospital: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    roomNumber: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
});

export default Events;