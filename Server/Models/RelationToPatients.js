import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const RelationToPatients = sequelize.define('RelationToPatients', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  contactPeopleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "ContactPeople", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  patientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Patients", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  relationType: { type: DataTypes.STRING, allowNull: false },
});

export default RelationToPatients;