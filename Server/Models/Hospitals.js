import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const Hospitals = sequelize.define('Hospitals', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  hospitalName: { type: DataTypes.STRING, allowNull: false },
});

export default Hospitals;