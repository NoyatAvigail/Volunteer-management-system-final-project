import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const VolunteeringForSectors = sequelize.define('VolunteeringForSectors', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  volunteerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Volunteers", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  sectorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Sectors", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
});

export default VolunteeringForSectors;