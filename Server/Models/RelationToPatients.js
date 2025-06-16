import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';
export const RelationToPatients = sequelize.define('RelationToPatients', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  contactPeopleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "ContactPeople", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  patientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Patients", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  relationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "FamilyRelations", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
});

export default RelationToPatients;