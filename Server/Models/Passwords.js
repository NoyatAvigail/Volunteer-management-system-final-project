import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const Passwords = sequelize.define("Passwords", {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "Users", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  password: { type: DataTypes.STRING, allowNull: false },
});

export default Passwords;