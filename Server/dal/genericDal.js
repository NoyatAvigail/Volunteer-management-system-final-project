import Sequelize from "sequelize";
import Users from '../models/Users.js';
import Passwords from '../models/Passwords.js';
import Events from '../models/Events.js';
import Sectors from '../models/Sectors.js';
import Genders from '../models/Genders.js';
import Hospitals from '../models/Hospitals.js';
import Departments from '../models/Departments.js';
import FamilyRelations from '../models/FamilyRelations.js';
import VolunteeringTypes from '../models/VolunteeringTypes.js';
import UserTypes from '../models/UserTypes.js';
import Hospitalizeds from '../models/Hospitalizeds.js'
import Volunteers from "../models/Volunteers.js";
import ContactPeople from "../models/ContactPeople.js";
import Patients from "../models/Patients.js";
import RelationToPatients from "../models/RelationToPatients.js";
import VolunteerTypes from "../models/VolunteerTypes.js";
import VolunteeringInDepartments from "../models/VolunteeringInDepartments.js";
import VolunteeringForSectors from "../models/VolunteeringForSectors.js";
import VolunteeringForGenders from "../models/VolunteeringForGenders.js";

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
                is_deleted: 0
            }
        });
    },

    findAll: (model) => {
        return model.findAll({
            where: {
                is_deleted: 0
            }
        })
    },

    findById: (model, id) => {
        return model.findOne({
            where: {
                id,
            }
        });
    },

    findByFieldIn: async (model, field, values) => {
        return await model.findAll({
            where: {
                [field]: values
            }
        });
    },

    getItemsByFieldInList: async (tableName, field, values) => {
        const Model = genericDAL.getModelByName(tableName);
        return await Model.findAll({
            where: {
                [field]: values
            }
        });
    },

    createModel: (Model, data, options = {}) => {
        return Model.create(data, options);
    },

    bulkCreateModel: (Model, dataArray, options = {}) => {
        return Model.bulkCreate(dataArray, options);
    },

    update: async (model, id, updatedFields) => {
        const item = await model.findByPk(id);
        if (item) {
            Object.assign(item, updatedFields);
            await item.save();
        }
        return item;
    },

    updateByField: async (model, id, updatedFields) => {
        const item = await model.findByPk(id);
        if (!item) return null;
        Object.assign(item, updatedFields);
        await item.save();
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

    deleteByFieldValue(modelName, fieldName, value) {
        const model = models[modelName];
        if (!model) throw new Error(`Model ${modelName} not found`);

        return model.destroy({
            where: {
                [fieldName]: value
            }
        });
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