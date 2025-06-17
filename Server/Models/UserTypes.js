import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const UserTypes = sequelize.define('UserTypes', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  description: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default UserTypes;