import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

const Passwords = sequelize.define("Passwords", {
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  password: { type: DataTypes.STRING, allowNull: false },
});

export default Passwords;