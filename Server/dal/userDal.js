import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';
import Volunteers from "../Models/Volunteers.js";
import ContactPeople from "../Models/ContactPeople.js"
import Patients from "../Models/Patients.js"
import RelationToPatients from '../Models/RelationToPatients.js'

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

    createUser: (userData) => {
        return Users.create(userData);
    },

    createVolunteer: (volunteerData) => {
        console.log('Creating volunteer with data:', volunteerData);
        return Volunteers.create(volunteerData);
    },

    createContact: (contactData) => {
        console.log('Creating contact with data:', contactData);
        return ContactPeople.create(contactData);
    },

    createPatient: (patientData) => {
        console.log('Creating patient with data:', patientData);
        return Patients.create(patientData);
    },

    createRelation: (relationData) => {
        console.log('Creating relation with data:', relationData);
        return RelationToPatients.create(relationData);
    },

    savePassword: (id, hashedPassword) => {
        console.log('Saving password for userId:', id, 'with hashed password:', hashedPassword);
        return Passwords.create({ id, password: hashedPassword });
    },

    getPasswordByUserId: (id) => Passwords.findOne({ where: { id } }),
};

export default userDal;