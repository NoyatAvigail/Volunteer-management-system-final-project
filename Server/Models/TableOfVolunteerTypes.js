import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const TableOfVolunteerTypes = sequelize.define('TableOfVolunteerTypes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "Volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  volunteerTypeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "VolunteeringTypes", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
});

export default TableOfVolunteerTypes;