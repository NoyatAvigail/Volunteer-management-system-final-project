import genericDAL from "../dal/genericDal.js"
import { capitalize } from "../utils/utils.js";
import { log } from "../utils/logger.js";

const service = {
    getItem: async (table, query) => {
        log('[GET ALL]', { table, query });
        const model = genericDAL.getModelByName((table));
        return genericDAL.findByField(model, query);
    },

    getAllItems: async (table) => {
        log('[GET ALL]', { table });
        const model = genericDAL.getModelByName((table));
        const data = genericDAL.findAll(model);
        return data;
    },

    getItemById: async (table, id) => {
        log('[GET]', { table, id });
        const model = genericDAL.getModelByName(capitalize(table));
        return genericDAL.findById(model, id);
    },

    getNestedItems: async (base, id, nested, body) => {
        log('[GET ALL]', { base, id, nested, body });
        const baseModel = genericDAL.getModelByName((base));
        const nestedModel = genericDAL.getModelByName((nested));
        return genericDAL.findNested(baseModel, id, nestedModel, body);
    },

    create: async (table, data) => {
        log('[POST]', { table, data });
        const model = genericDAL.getModelByName((table));
        return genericDAL.create(model, data);
    },

    updateItemField: async (table, id, body) => {
        log('[PATCH]', { table, id, body });
        const model = genericDAL.getModelByName((table));
        return genericDAL.updateFields(model, id, body);
    },

    softDeleteItem: async (table, id) => {
        log('[DELETE]', { table, id });
        const model = genericDAL.getModelByName((table));
        return genericDAL.updateFields(model, id, {
            is_deleted: 0,
            deleted_at: new Date()
        });
    },

    cleanup: () => {
        setInterval(() => {
            genericDAL.cleanupOldDeleted();
        }, 14 * 24 * 60 * 60 * 1000);
    }
};

export default service;