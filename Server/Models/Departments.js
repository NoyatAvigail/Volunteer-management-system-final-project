import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const Departments = sequelize.define('Departments', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  departmentName: { type: DataTypes.STRING, allowNull: false },
});

export default Departments;