import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const RelationToPatients = sequelize.define('RelationToPatients', {
  contactPeopleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "ContactPeople", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  patientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Patients", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  relationType: { type: DataTypes.STRING, allowNull: false },
});

export default RelationToPatients;