import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const VolunteeringTypes = sequelize.define('VolunteeringTypes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: DataTypes.STRING, allowNull: false },
});

export default VolunteeringTypes;