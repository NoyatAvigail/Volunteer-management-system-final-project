import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const Genders = sequelize.define('Genders', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  description: { type: DataTypes.STRING, allowNull: false },
});

export default Genders;