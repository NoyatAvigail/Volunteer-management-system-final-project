import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';
import Volunteers from "../Models/Volunteers.js";
import ContactPeople from "../Models/ContactPeople.js"
import Patients from "../Models/Patients.js"
import RelationToPatients from '../Models/RelationToPatients.js'
import Hospitalizeds from '../Models/Hospitalizeds.js';
import VolunteeringInDepartments from '../Models/VolunteeringInDepartments.js';
import VolunteeringForSectors from '../Models/VolunteeringForSectors.js';
import VolunteeringForGenders from '../models/VolunteeringForGenders.js';   
import VolunteerTypes from '../models/VolunteerTypes.js';
const userDal = {
    findByEmail: (email) => {
        return Users.findOne({ where: { email } });
    },

    findVolunteerByUserId: (userId) => {
        return Volunteers.findOne({ where: { userId } });
    },

    findContactByUserId: (userId) => {
        return ContactPeople.findOne({ where: { userId } });
    },

    createModel: (model, data) => {
        return model.create(data);
    },
    // createVolunteerTypes: (volunteerTypeData) => {
    //     return VolunteerTypes.create(volunteerTypeData);
    // },
    // createVolunteer: (volunteerData) => {
    //     return Volunteers.create(volunteerData);
    // },
    // createVolunteeringForGenders: (volunteeringForGendersData) => {
    //     return VolunteeringForGenders.create(volunteeringForGendersData);
    // },
    // createVolunteeringForSectors: (volunteeringForSectorsData) => {
    //     return VolunteeringForSectors.create(volunteeringForSectorsData);
    // },
    // createVolunteeringInDepartments: (volunteeringInDepartmentsData) => {
    //     return VolunteeringInDepartments.create(volunteeringInDepartmentsData);
    // },

    // createContact: (contactData) => {
    //     return ContactPeople.create(contactData);
    // },

    // createPatient: (patientData) => {
    //     return Patients.create(patientData);
    // },

    // createRelation: (relationData) => {
    //     return RelationToPatients.create(relationData);
    // },

    // createHospitalizeds: (HospitalizedsData) => {
    //     return Hospitalizeds.create(HospitalizedsData);
    // },

    savePassword: (id, hashedPassword) => {
        return Passwords.create({ id, password: hashedPassword });
    },

    getPasswordByUserId: (id) => Passwords.findOne({ where: { id } }),
};

export default userDal;