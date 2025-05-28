import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const VolunteersDepartments = sequelize.define('VolunteersDepartments', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  volunteerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Volunteers", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  hospital: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
});

export default VolunteersDepartments;