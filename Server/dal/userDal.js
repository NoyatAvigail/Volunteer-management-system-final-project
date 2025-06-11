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

    createModel: (Model, data, options = {}) => {
        return Model.create(data, options);
    },

    bulkCreateModel: (Model, dataArray, options = {}) => {
        return Model.bulkCreate(dataArray, options);
    },

    // savePassword: (id, hashedPassword, options = {}) => {
    //     return Passwords.create({ id, password: hashedPassword, options });
    // },

    getPasswordByUserId: (id) => Passwords.findOne({ where: { id } }),
};

export default userDal;