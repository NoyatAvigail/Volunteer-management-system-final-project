import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const Hospitalized = sequelize.define('Hospitalized', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Patients", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  hospital: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  roomNumber: { type: DataTypes.STRING },
  hospitalizationStart: { type: DataTypes.DATE },
  hospitalizationEnd: { type: DataTypes.DATE },
});

export default Hospitalized;