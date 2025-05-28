import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const VolunteeringForGenders = sequelize.define('VolunteeringForGenders', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  volunteerId: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: "Volunteers", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  genderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Genders", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
});

export default VolunteeringForGenders; 