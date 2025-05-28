import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const AgeRange = sequelize.define('AgeRange', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "volunteers", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  patientAgeFrom: { type: DataTypes.INTEGER },
  patientAgeTo: { type: DataTypes.INTEGER },
});

export default AgeRange;