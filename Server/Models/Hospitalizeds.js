import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';
export const Hospitalizeds = sequelize.define('Hospitalizeds', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Patients", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  hospital: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  roomNumber: { type: DataTypes.STRING },
  hospitalizationStart: { type: DataTypes.DATE },
  hospitalizationEnd: { type: DataTypes.DATE },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
});


export default Hospitalizeds;