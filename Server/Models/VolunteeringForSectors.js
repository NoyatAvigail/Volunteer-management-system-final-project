import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const VolunteeringForSectors = sequelize.define('VolunteeringForSectors', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  sectorId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "Sectors", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default VolunteeringForSectors;