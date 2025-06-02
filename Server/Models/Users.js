import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const Users = sequelize.define('Users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  type: { type: DataTypes.STRING, allowNull: false },
});

export default Users;