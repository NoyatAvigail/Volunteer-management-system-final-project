import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const Hospitals = sequelize.define('Hospitals', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  description: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default Hospitals;