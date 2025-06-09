import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const VolunteerDiaries = sequelize.define('VolunteerDiaries', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  fromHour: { type: DataTypes.TIME, allowNull: false },
  toHour: { type: DataTypes.TIME, allowNull: false },
});

export default VolunteerDiaries;