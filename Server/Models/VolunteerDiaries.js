import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const VolunteerDiaries = sequelize.define('VolunteerDiaries', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  volunteerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Volunteers", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  volunteeringDay: { type: DataTypes.STRING, allowNull: false },
  fromHour: { type: DataTypes.TIME, allowNull: false },
  toHour: { type: DataTypes.TIME, allowNull: false },
});

export default VolunteerDiaries;