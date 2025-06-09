import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const Volunteers = sequelize.define('Volunteers', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  fullName: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATE, allowNull: false },
  gender: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Genders", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  sector: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Sectors", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  address: { type: DataTypes.STRING, allowNull: false },
  volunteerStartDate: { type: DataTypes.DATE },
  volunteerEndDate: { type: DataTypes.DATE },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
  flexible: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export default Volunteers;