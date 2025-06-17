import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';
export const Hospitalizeds = sequelize.define('Hospitalizeds', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Patients", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  hospital: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Hospitals", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  department: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Departments", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  roomNumber: { type: DataTypes.STRING },
  hospitalizationStart: { type: DataTypes.DATE },
  hospitalizationEnd: { type: DataTypes.DATE },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});


export default Hospitalizeds;