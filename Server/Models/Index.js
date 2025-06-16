import sequelize from '../../DB/connectionDB.mjs';
import ContactPeople from './ContactPeople.js';
import Patients from './Patients.js';
import Hospitalizeds from './Hospitalizeds.js';
import RelationToPatients from './RelationToPatients.js';
import Users from './Users.js';
import VolunteerTypes from './VolunteerTypes.js';
import VolunteeringForGenders from './VolunteeringForGenders.js'; 
import VolunteeringForSectors from './VolunteeringForSectors.js';
import VolunteeringInDepartments from './VolunteeringInDepartments.js';
import Volunteers from './Volunteers.js';
// קשר בין Patients ל-ContactPeople
Patients.belongsTo(ContactPeople, {
  foreignKey: 'contactPeopleId',
  as: 'contact'
});
ContactPeople.hasMany(Patients, {
  foreignKey: 'contactPeopleId',
  as: 'patients'
});

// קשר בין Patients ל-Hospitalizeds
Patients.hasMany(Hospitalizeds, { foreignKey: 'patientId', as: 'hospitalizeds' });
Hospitalizeds.belongsTo(Patients, { foreignKey: 'patientId', as: 'patient' });

// קשר בין Patients ל-RelationToPatients
Patients.hasMany(RelationToPatients, { foreignKey: 'patientId', as: 'relation' });
RelationToPatients.belongsTo(Patients, { foreignKey: 'patientId', as: 'patient' });

// קשר בין ContactPeople ל-RelationToPatients
ContactPeople.hasMany(RelationToPatients, { foreignKey: 'contactPeopleId', as: 'relation' });
RelationToPatients.belongsTo(ContactPeople, { foreignKey: 'contactPeopleId', as: 'contactPerson' });
ContactPeople.belongsTo(Users, { foreignKey: 'userId' });
Users.hasOne(ContactPeople, { foreignKey: 'userId' });
Volunteers.hasMany(VolunteerTypes, { foreignKey: 'id', sourceKey: 'id' });
Volunteers.hasMany(VolunteeringInDepartments, { foreignKey: 'id', sourceKey: 'id' });
Volunteers.hasMany(VolunteeringForSectors, { foreignKey: 'id', sourceKey: 'id' });
Volunteers.hasMany(VolunteeringForGenders, { foreignKey: 'id', sourceKey: 'id' });

VolunteerTypes.belongsTo(Volunteers, { foreignKey: 'id' });
VolunteeringInDepartments.belongsTo(Volunteers, { foreignKey: 'id' });
VolunteeringForSectors.belongsTo(Volunteers, { foreignKey: 'id' });
VolunteeringForGenders.belongsTo(Volunteers, { foreignKey: 'id' });
export {
  sequelize,
  ContactPeople,
  Patients,
  Hospitalizeds,
  RelationToPatients,
  VolunteeringForGenders,
  VolunteeringForSectors,
  VolunteeringInDepartments,
  VolunteerTypes,
  Volunteers,
  Users,
};
