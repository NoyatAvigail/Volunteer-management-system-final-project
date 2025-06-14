import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';
import Volunteers from "../Models/Volunteers.js";
import ContactPeople from "../Models/ContactPeople.js"
import Patients from "../Models/Patients.js"
import Hospitalizeds from '../Models/Hospitalizeds.js';

const models = { Users, Passwords, Hospitalizeds, Patients };

const userDal = {
    getModelByName: (name) => {
        console.log(models[name]);
        return models[name]
    },

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

    getPasswordByUserId: (id) => Passwords.findOne({ where: { id } }),
};

export default userDal;