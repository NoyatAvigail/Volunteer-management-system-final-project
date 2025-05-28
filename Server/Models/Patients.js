import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const Patients = sequelize.define('Patients', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  contactPeopleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "ContactPeople", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  fullName: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATE, allowNull: false },
  sector: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  dateOfDeath: { type: DataTypes.DATE, allowNull: true },
  interestedInReceivingNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
});

export default Patients;