import sequelize from './connectionDB.mjs';
import { UserTypes } from '../Server/Models/UserTypes.js';
import { Genders } from '../Server/models/Genders.js';
import { Hospitals } from '../Server/Models/Hospitals.js';
import { Departments } from '../Server/Models/Departments.js';
import { Sectors } from '../Server/Models/Sectors.js';
import { VolunteeringTypes } from '../Server/Models/VolunteeringTypes.js';
import { FamilyRelations } from '../Server/Models/FamilyRelations.js';
import { Users } from '../Server/Models/Users.js';
import { Passwords } from '../Server/Models/Passwords.js';
import { Volunteers } from '../Server/Models/Volunteers.js';
import { ContactPeople } from '../Server/Models/ContactPeople.js';
import { Patients } from '../Server/Models/Patients.js';
import { Hospitalizeds } from '../Server/Models/Hospitalizeds.js';
import { RelationToPatients } from '../Server/Models/RelationToPatients.js';
import { VolunteeringInDepartments } from '../Server/Models/VolunteeringInDepartments.js';
import { VolunteeringForSectors } from '../Server/Models/VolunteeringForSectors.js';
import { VolunteeringForGenders } from '../Server/Models/VolunteeringForGenders.js';
import { VolunteerTypes } from '../Server/Models/VolunteerTypes.js';
import { Events } from '../Server/Models/Events.js';

// Users ←→ Passwords
Users.hasMany(Passwords, { foreignKey: 'id', onDelete: 'CASCADE' });
Passwords.belongsTo(Users, { foreignKey: 'id', onDelete: 'CASCADE' });

// Users ←→ UserType
Users.belongsTo(UserTypes, { foreignKey: 'type', onDelete: 'CASCADE' });
UserTypes.hasMany(Users, { foreignKey: 'type', onDelete: 'CASCADE' });

// Users ←→ Volunteers / ContactPeople
Users.hasOne(Volunteers, { foreignKey: 'userId', onDelete: 'CASCADE' });
Volunteers.belongsTo(Users, { foreignKey: 'userId' });

Users.hasOne(ContactPeople, { foreignKey: 'userId', onDelete: 'CASCADE' });
ContactPeople.belongsTo(Users, { foreignKey: 'userId' });

// Volunteers ←→ Volunteering Details
Volunteers.hasMany(VolunteeringInDepartments, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteeringInDepartments.belongsTo(Volunteers, { foreignKey: 'id', onDelete: 'CASCADE' });

Volunteers.hasMany(VolunteeringForSectors, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteeringForSectors.belongsTo(Volunteers, { foreignKey: 'id', onDelete: 'CASCADE' });

Volunteers.hasMany(VolunteeringForGenders, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteeringForGenders.belongsTo(Volunteers, { foreignKey: 'id', onDelete: 'CASCADE' });

Volunteers.hasMany(VolunteerTypes, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteerTypes.belongsTo(Volunteers, { foreignKey: 'id', onDelete: 'CASCADE' });

VolunteeringInDepartments.hasMany(Departments, { foreignKey: 'departmentId', onDelete: 'CASCADE' });
Departments.belongsTo(VolunteeringInDepartments, { foreignKey: 'departmentId', onDelete: 'CASCADE' });

Sectors.hasMany(VolunteeringForSectors, { foreignKey: 'sectorId', onDelete: 'CASCADE' });
VolunteeringForSectors.belongsTo(Sectors, { foreignKey: 'sectorId', onDelete: 'CASCADE' });

Genders.hasMany(VolunteeringForGenders, { foreignKey: 'genderId', onDelete: 'CASCADE' });
VolunteeringForGenders.belongsTo(Genders, { foreignKey: 'genderId', onDelete: 'CASCADE' });

VolunteeringTypes.hasMany(VolunteerTypes, { foreignKey: 'volunteerTypeId', onDelete: 'CASCADE' });
VolunteerTypes.belongsTo(VolunteeringTypes, { foreignKey: 'volunteerTypeId', onDelete: 'CASCADE' });

// Patients ←→ Hospitalizeds / RelationToPatients
Patients.hasMany(Hospitalizeds, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Hospitalizeds.belongsTo(Patients, { foreignKey: 'patientId', onDelete: 'CASCADE' });

Patients.hasMany(RelationToPatients, { foreignKey: 'patientId', onDelete: 'CASCADE' });
RelationToPatients.belongsTo(Patients, { foreignKey: 'patientId', onDelete: 'CASCADE' });

ContactPeople.hasMany(RelationToPatients, { foreignKey: 'contactPeopleId', onDelete: 'CASCADE' });
RelationToPatients.belongsTo(ContactPeople, { foreignKey: 'contactPeopleId', onDelete: 'CASCADE' });

FamilyRelations.hasOne(RelationToPatients, { foreignKey: 'relationId', onDelete: 'CASCADE' });
RelationToPatients.belongsTo(FamilyRelations, { foreignKey: 'relationId', onDelete: 'CASCADE' });

ContactPeople.hasMany(Patients, { foreignKey: 'contactPeopleId', as: 'patients', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patients.belongsTo(ContactPeople, { foreignKey: 'contactPeopleId', as: 'contactPerson' });
// Events ←→ Patients / Volunteers / ContactPeople
Volunteers.hasMany(Events, { foreignKey: 'volunteerId', sourceKey: 'userId', onDelete: 'CASCADE' });
Events.belongsTo(Volunteers, { foreignKey: 'volunteerId', targetKey: 'userId', onDelete: 'CASCADE' });

ContactPeople.hasMany(Events, { foreignKey: 'contactId', sourceKey: 'userId', onDelete: 'CASCADE' });
Events.belongsTo(ContactPeople, { foreignKey: 'contactId', targetKey: 'userId', onDelete: 'CASCADE' });

Hospitalizeds.hasMany(Events, { foreignKey: 'hospitalizedsId', sourceKey: 'id', onDelete: 'CASCADE' });
Events.belongsTo(Hospitalizeds, { foreignKey: 'hospitalizedsId', targetKey: 'id', onDelete: 'CASCADE' });

export {
  sequelize,
  UserTypes,
  Genders,
  Hospitals,
  Departments,
  Sectors,
  VolunteeringTypes,
  FamilyRelations,
  Users,
  Passwords,
  Volunteers,
  ContactPeople,
  Patients,
  Hospitalizeds,
  RelationToPatients,
  VolunteeringInDepartments,
  VolunteeringForSectors,
  VolunteeringForGenders,
  VolunteerTypes,
  Events
};