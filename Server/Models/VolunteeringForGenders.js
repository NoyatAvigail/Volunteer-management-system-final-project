import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const VolunteeringForGenders = sequelize.define('VolunteeringForGenders', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  genderId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "Genders", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default VolunteeringForGenders; 