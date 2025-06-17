import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const VolunteerTypes = sequelize.define('VolunteerTypes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "Volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  volunteerTypeId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "VolunteeringTypes", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default VolunteerTypes;