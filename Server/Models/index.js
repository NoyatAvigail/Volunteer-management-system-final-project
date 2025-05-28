// import sequelize from '../../DB/db.mjs';
// import { Users } from '../Models/Users.js';
// import { Volunteers } from '../Models/Volunteers.js';
// import { Patients } from '../Models/Patients.js';
// import { ContactPeople } from '../Models/ContactPeople.js';
// import { Hospitalized } from '../Models/Hospitalized.js';
// import { VolunteersDepartments } from '../Models/VolunteersDepartments.js';
// import { VolunteeringForSectors } from '../Models/VolunteeringForSectors.js';
// import { VolunteeringForGenders } from '../Models/VolunteeringForGenders.js';
// import { VolunteerDiaries } from '../Models/VolunteerDiaries.js';
// import { TableOfVolunteerTypes } from '../Models/TableOfVolunteerTypes.js';
// import { RelationToPatients } from '../Models/RelationToPatients.js';
// import { Hospitals } from '../Models/Hospitals.js';
// import { Sectors } from '../Models/Sectors.js';
// import { Genders } from '../Models/Genders.js';
// import { VolunteeringTypes } from '../Models/VolunteeringTypes.js';

// Users.hasOne(Volunteers, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Volunteers.belongsTo(Users, { foreignKey: 'userId' });

// Users.hasOne(Patients, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Patients.belongsTo(Users, { foreignKey: 'userId' });

// Users.hasOne(ContactPeople, { foreignKey: 'userId', onDelete: 'CASCADE' });
// ContactPeople.belongsTo(Users, { foreignKey: 'userId' });

// Volunteers.hasOne(VolunteersDepartments, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
// VolunteersDepartments.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

// Volunteers.hasOne(VolunteeringForSectors, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
// VolunteeringForSectors.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

// Volunteers.hasOne(VolunteeringForGenders, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
// VolunteeringForGenders.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

// Volunteers.hasOne(VolunteerDiaries, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
// VolunteerDiaries.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

// Volunteers.hasOne(TableOfVolunteerTypes, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
// TableOfVolunteerTypes.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

// Sectors.hasMany(VolunteeringForSectors, { foreignKey: 'sectorId', onDelete: 'CASCADE' });
// VolunteeringForSectors.belongsTo(Sectors, { foreignKey: 'sectorId' });

// Genders.hasMany(VolunteeringForGenders, { foreignKey: 'genderId', onDelete: 'CASCADE' });
// VolunteeringForGenders.belongsTo(Genders, { foreignKey: 'genderId' });

// VolunteeringTypes.hasMany(TableOfVolunteerTypes, { foreignKey: 'volunteerTypeId', onDelete: 'CASCADE' });
// TableOfVolunteerTypes.belongsTo(VolunteeringTypes, { foreignKey: 'volunteerTypeId' });

// Patients.hasOne(Hospitalized, { foreignKey: 'patientId', onDelete: 'CASCADE' });
// Hospitalized.belongsTo(Patients, { foreignKey: 'patientId' });

// Patients.hasOne(RelationToPatients, { foreignKey: 'patientId', onDelete: 'CASCADE' });
// RelationToPatients.belongsTo(Patients, { foreignKey: 'patientId' });

// ContactPeople.hasOne(RelationToPatients, { foreignKey: 'contactPeopleId', onDelete: 'CASCADE' });
// RelationToPatients.belongsTo(ContactPeople, { foreignKey: 'contactPeopleId' });

// export {
//   sequelize,
//   Users,
//   Volunteers,
//   Patients,
//   ContactPeople,
//   Hospitalized,
//   VolunteersDepartments,
//   VolunteeringForSectors,
//   VolunteeringForGenders,
//   VolunteerDiaries,
//   TableOfVolunteerTypes,
//   RelationToPatients,
//   Hospitals,
//   Sectors,
//   Genders,
//   VolunteeringTypes,
// };
import sequelize from '../../DB/db.mjs';
import { Users } from '../Models/Users.js';
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

Users.hasOne(Volunteers, { foreignKey: 'userId', onDelete: 'CASCADE' });
Volunteers.belongsTo(Users, { foreignKey: 'userId' });

Users.hasOne(Patients, { foreignKey: 'userId', onDelete: 'CASCADE' });
Patients.belongsTo(Users, { foreignKey: 'userId' });

Users.hasOne(ContactPeople, { foreignKey: 'userId', onDelete: 'CASCADE' });
ContactPeople.belongsTo(Users, { foreignKey: 'userId' });

Volunteers.hasOne(VolunteersDepartments, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
VolunteersDepartments.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

Volunteers.hasOne(VolunteeringForSectors, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
VolunteeringForSectors.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

Volunteers.hasOne(VolunteeringForGenders, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
VolunteeringForGenders.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

Volunteers.hasOne(VolunteerDiaries, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
VolunteerDiaries.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

Volunteers.hasOne(TableOfVolunteerTypes, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
TableOfVolunteerTypes.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

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

Volunteers.hasMany(FixedVolunteerAvailability, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
FixedVolunteerAvailability.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

Volunteers.hasMany(OneTimeVolunteerAvailability, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
OneTimeVolunteerAvailability.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

Volunteers.hasOne(AgeRange, { foreignKey: 'volunteerId', onDelete: 'CASCADE' });
AgeRange.belongsTo(Volunteers, { foreignKey: 'volunteerId' });

export {
  sequelize,
  Users,
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
  AgeRange,
};
