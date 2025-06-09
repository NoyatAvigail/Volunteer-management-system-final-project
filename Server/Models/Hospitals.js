import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const Hospitals = sequelize.define('Hospitals', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  description: { type: DataTypes.STRING, allowNull: false },
});

export default Hospitals;