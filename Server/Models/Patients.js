import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const Patients = sequelize.define('Patients', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  contactPeopleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "ContactPeople", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  fullName: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATE, allowNull: false },
  sector: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  dateOfDeath: { type: DataTypes.DATE, allowNull: true },
  interestedInReceivingNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});
export default Patients;