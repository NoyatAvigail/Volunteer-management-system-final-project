import sequelize from '../../DB/db.mjs';
import { Users } from '../Models/Users.js';
import { Passwords } from '../Models/Passwords.js'; 
import { Volunteers } from '../Models/Volunteers.js';
import { Patients } from '../Models/Patients.js';
import { ContactPeople } from '../Models/ContactPeople.js';
import { Hospitalized } from '../Models/Hospitalized.js';
import { VolunteersDepartments } from '../Models/VolunteersDepartments.js';
import { VolunteeringForSectors } from '../Models/VolunteeringForSectors.js';
import { VolunteeringForGenders } from '../Models/VolunteeringForGenders.js';
import { VolunteerDiaries } from '../Models/VolunteerDiaries.js';
import { TableOfVolunteerTypes } from '../Models/TableOfVolunteerTypes.js';
import { RelationToPatients } from '../Models/RelationToPatients.js';
import { Hospitals } from '../Models/Hospitals.js';
import { Sectors } from '../Models/Sectors.js';
import { Genders } from '../Models/Genders.js';
import { VolunteeringTypes } from '../Models/VolunteeringTypes.js';
import { FixedVolunteerAvailability } from '../Models/FixedVolunteerAvailability.js';
import { OneTimeVolunteerAvailability } from '../Models/OneTimeVolunteerAvailability.js';
import { AgeRange } from '../Models/AgeRange.js';

Users.hasOne(Passwords, { foreignKey: 'id', onDelete: 'CASCADE' });
Passwords.belongsTo(Users, { foreignKey: 'id' });

Users.hasOne(Volunteers, { foreignKey: 'userId', onDelete: 'CASCADE' });
Volunteers.belongsTo(Users, { foreignKey: 'userId' });

Users.hasOne(ContactPeople, { foreignKey: 'id', onDelete: 'CASCADE' });
ContactPeople.belongsTo(Users, { foreignKey: 'id' });

Volunteers.hasOne(VolunteersDepartments, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteersDepartments.belongsTo(Volunteers, { foreignKey: 'id' });

Volunteers.hasOne(VolunteeringForSectors, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteeringForSectors.belongsTo(Volunteers, { foreignKey: 'id' });

Volunteers.hasOne(VolunteeringForGenders, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteeringForGenders.belongsTo(Volunteers, { foreignKey: 'id' });

Volunteers.hasOne(VolunteerDiaries, { foreignKey: 'id', onDelete: 'CASCADE' });
VolunteerDiaries.belongsTo(Volunteers, { foreignKey: 'id' });

Volunteers.hasOne(TableOfVolunteerTypes, { foreignKey: 'id', onDelete: 'CASCADE' });
TableOfVolunteerTypes.belongsTo(Volunteers, { foreignKey: 'id' });

Sectors.hasMany(VolunteeringForSectors, { foreignKey: 'sectorId', onDelete: 'CASCADE' });
VolunteeringForSectors.belongsTo(Sectors, { foreignKey: 'sectorId' });

Genders.hasMany(VolunteeringForGenders, { foreignKey: 'genderId', onDelete: 'CASCADE' });
VolunteeringForGenders.belongsTo(Genders, { foreignKey: 'genderId' });

VolunteeringTypes.hasMany(TableOfVolunteerTypes, { foreignKey: 'volunteerTypeId', onDelete: 'CASCADE' });
TableOfVolunteerTypes.belongsTo(VolunteeringTypes, { foreignKey: 'volunteerTypeId' });

Patients.hasOne(Hospitalized, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Hospitalized.belongsTo(Patients, { foreignKey: 'patientId' });

Patients.hasOne(RelationToPatients, { foreignKey: 'patientId', onDelete: 'CASCADE' });
RelationToPatients.belongsTo(Patients, { foreignKey: 'patientId' });

ContactPeople.hasOne(RelationToPatients, { foreignKey: 'contactPeopleId', onDelete: 'CASCADE' });
RelationToPatients.belongsTo(ContactPeople, { foreignKey: 'contactPeopleId' });

Volunteers.hasMany(FixedVolunteerAvailability, { foreignKey: 'id', onDelete: 'CASCADE' });
FixedVolunteerAvailability.belongsTo(Volunteers, { foreignKey: 'id' });

Volunteers.hasMany(OneTimeVolunteerAvailability, { foreignKey: 'id', onDelete: 'CASCADE' });
OneTimeVolunteerAvailability.belongsTo(Volunteers, { foreignKey: 'id' });

Volunteers.hasOne(AgeRange, { foreignKey: 'id', onDelete: 'CASCADE' });
AgeRange.belongsTo(Volunteers, { foreignKey: 'id' });

export {
  sequelize,
  Users,
  Passwords,
  Volunteers,
  Patients,
  ContactPeople,
  Hospitalized,
  VolunteersDepartments,
  VolunteeringForSectors,
  VolunteeringForGenders,
  VolunteerDiaries,
  TableOfVolunteerTypes,
  RelationToPatients,
  Hospitals,
  Sectors,
  Genders,
  VolunteeringTypes,
  FixedVolunteerAvailability,
  OneTimeVolunteerAvailability,
  AgeRange
};