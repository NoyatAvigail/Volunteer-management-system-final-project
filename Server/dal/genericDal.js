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
import Hospitalizeds from '../Models/Hospitalizeds.js';
import Patients from "../Models/Patients.js";   

const models = { Users, Passwords, Events, Sectors, Genders, Hospitals, Departments, FamilyRelations, VolunteeringTypes, UserTypes, Hospitalizeds, Patients };

const genericDAL = {
    getModelByName: (name) => {
        console.log(models[name]);
        return models[name]
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
            where: whereClause
        });
    },

    findAll: (model) => {
        return model.findAll()
    },

    findById: (model, id) => {
        return model.findOne({
            where: {
                id,
                is_deleted: 1
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
                is_deleted: 1
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
    }
};

export default genericDAL;
