import Sequelize from "sequelize";
import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';
import Events from '../Models/Events.js';
import Sectors from '../Models/Sectors.js';
import Genders from '../models/Genders.js';
import Hospitals from '../Models/Hospitals.js';
import Departments from '../Models/Departments.js';
import FamilyRelations from '../Models/FamilyRelations.js';
import VolunteeringTypes from '../Models/VolunteeringTypes.js';
import UserTypes from '../Models/UserTypes.js';
import Hospitalizeds from '../Models/Hospitalizeds.js'
import Volunteers from "../Models/Volunteers.js";
import ContactPeople from "../Models/ContactPeople.js";
import Patients from "../Models/Patients.js";
import RelationToPatients from "../Models/RelationToPatients.js";
import VolunteerTypes from "../Models/VolunteerTypes.js";
import VolunteeringInDepartments from "../Models/VolunteeringInDepartments.js";
import VolunteeringForSectors from "../Models/VolunteeringForSectors.js";
import VolunteeringForGenders from "../Models/VolunteeringForGenders.js";

const models = {
    Users, Passwords, Events, Sectors, Genders, Hospitals, Departments,
    FamilyRelations, VolunteeringTypes, UserTypes, Hospitalizeds, Volunteers,
    ContactPeople, Patients, RelationToPatients, VolunteerTypes,
    VolunteeringInDepartments, VolunteeringForSectors, VolunteeringForGenders
};
 
const genericDAL = {
    getModelByName: (name) => {
        if (!models[name]) {
            throw new Error(`Model '${name}' not found in genericDAL`);
        }
        return models[name];
    },

    findByField: (model, query) => {
        const field = Object.keys(query)[0];
        const value = query[field];
        const whereClause = {
            [field]: value
        };
        if ('is_deleted' in model.rawAttributes) {
            whereClause.is_deleted = 0;
        }
        return model.findAll({
            where: {
                [field]: value,
                // is_deleted: 1
            }
            // where: whereClause
        });
    },

    findAll: (model) => {
        return model.findAll()
    },

    findById: (model, id) => {
        return model.findOne({
            where: {
                id,
            }
        });
    },

    findNested: async (baseModel, id, nestedModel, query) => {
        Object.keys(query).forEach(key => {
            if (!isNaN(query[key])) {
                query[key] = parseInt(query[key], 10);
            }
        });
        const items = await nestedModel.findAll({
            where: {
                ...query,
            }
        });
        return items;
    },

    createModel: (Model, data, options = {}) => {
        return Model.create(data, options);
    },

    bulkCreateModel: (Model, dataArray, options = {}) => {
        return Model.bulkCreate(dataArray, options);
    },
    
    updateFields: async (model, id, updatedFields) => {
        const item = await model.findByPk(id);
        if (item) {
            Object.assign(item, updatedFields);
            await item.save();
        }
        return item;
    },

    cleanupOldDeleted: async () => {
        for (const modelName in models) {
            const model = models[modelName];
            try {
                await model.destroy({
                    where: {
                        deleted_at: { [Sequelize.Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                    }
                });
                console.log(`Old deleted records cleaned up from ${model.name}`);
            } catch (error) {
                console.error(`Error cleaning up old deleted records from ${model.name}:`, error);
            }
        }
    },

    findOneWithIncludes: (modelName, query, includes) => {
        const model = models[modelName];
        return model.findOne({
            where: query,
            include: includes
        });
    }
};

export default genericDAL;