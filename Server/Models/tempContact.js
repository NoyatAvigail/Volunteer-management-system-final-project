import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const ContactPeople = sequelize.define('ContactPeople', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  fullName: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default ContactPeople;