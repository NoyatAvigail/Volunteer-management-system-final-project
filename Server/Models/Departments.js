import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const Departments = sequelize.define('Departments', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  departmentName: { type: DataTypes.STRING, allowNull: false },
});

export default Departments;