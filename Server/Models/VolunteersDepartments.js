import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const VolunteersDepartments = sequelize.define('VolunteersDepartments', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  hospital: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  department: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
});

export default VolunteersDepartments;