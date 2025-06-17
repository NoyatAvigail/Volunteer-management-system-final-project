import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const VolunteeringTypes = sequelize.define('VolunteeringTypes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default VolunteeringTypes;