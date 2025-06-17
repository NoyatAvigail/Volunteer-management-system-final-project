import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const Users = sequelize.define('Users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  type: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'UserTypes', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default Users;