import sequelize from './connectionDB.mjs';
import { Users } from '../Server/models/Users.js';
import { Passwords } from '../Server/models/Passwords.js';
import { Volunteers } from '../Server/models/Volunteers.js';
import { Patients } from '../Server/models/Patients.js';
import { ContactPeople } from '../Server/models/ContactPeople.js';
import { Hospitalizeds } from '../Server/models/Hospitalizeds.js';
import { VolunteeringInDepartments } from '../Server/models/VolunteeringInDepartments.js';
import { VolunteeringForSectors } from '../Server/models/VolunteeringForSectors.js';
import { VolunteeringForGenders } from '../Server/models/VolunteeringForGenders.js';
import { VolunteerTypes } from '../Server/models/VolunteerTypes.js';
import { RelationToPatients } from '../Server/models/RelationToPatients.js';
import { Hospitals } from '../Server/models/Hospitals.js';
import { Sectors } from '../Server/models/Sectors.js';
import { Genders } from '../Server/models/Genders.js';
import { FamilyRelations } from '../Server/models/FamilyRelations.js';
import { VolunteeringTypes } from '../Server/models/VolunteeringTypes.js';
import { FixedVolunteerAvailability } from '../Server/models/FixedVolunteerAvailability.js';
import { OneTimeVolunteerAvailability } from '../Server/models/OneTimeVolunteerAvailability.js';
import { Departments } from '../Server/models/Departments.js';
import { UserTypes } from '../Server/models/UserTypes.js';
import { Events } from '../Server/models/Events.js';

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
VolunteeringInDepartments.belongsTo(Volunteers, { foreignKey: 'id' , onDelete: 'CASCADE' });

Volunteers.hasMany(VolunteeringForSectors, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteeringForSectors.belongsTo(Volunteers, { foreignKey: 'id', onDelete: 'CASCADE' });

Volunteers.hasMany(VolunteeringForGenders, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteeringForGenders.belongsTo(Volunteers, { foreignKey: 'id', onDelete: 'CASCADE' });

Volunteers.hasMany(VolunteerTypes, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteerTypes.belongsTo(Volunteers, { foreignKey: 'id', onDelete: 'CASCADE' });

Volunteers.hasMany(FixedVolunteerAvailability, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
FixedVolunteerAvailability.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

Volunteers.hasMany(OneTimeVolunteerAvailability, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
OneTimeVolunteerAvailability.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

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

// Events ←→ Patients / Volunteers / ContactPeople
Volunteers.hasMany(Events, { foreignKey: 'volunteerId', sourceKey: 'userId', onDelete: 'CASCADE' });
Events.belongsTo(Volunteers, { foreignKey: 'volunteerId', targetKey: 'userId', onDelete: 'CASCADE' });

ContactPeople.hasMany(Events, { foreignKey: 'contactId', sourceKey: 'userId', onDelete: 'CASCADE' });
Events.belongsTo(ContactPeople, { foreignKey: 'contactId', targetKey: 'userId', onDelete: 'CASCADE' });

Hospitalizeds.hasMany(Events, { foreignKey: 'HospitalizedsId', onDelete: 'CASCADE' });
Events.belongsTo(Hospitalizeds, { foreignKey: 'HospitalizedsId', onDelete: 'CASCADE' });

export {
  sequelize,
  Users,
  Passwords,
  Volunteers,
  Patients,
  ContactPeople,
  Hospitalizeds,
  VolunteeringInDepartments,
  VolunteeringForSectors,
  VolunteeringForGenders,
  VolunteeringTypes,
  RelationToPatients,
  VolunteerTypes,
  Hospitals,
  Sectors,
  Genders,
  FamilyRelations,
  FixedVolunteerAvailability,
  OneTimeVolunteerAvailability,
  Events,
  Departments,
  UserTypes
};