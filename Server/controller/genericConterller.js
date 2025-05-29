import service from "../services/genericService.js";

const genericConterller = {

    getAllOrByValue: async (req, res) => {
        try {
            if (Object.keys(req.query).length == 0) {
                const items = await service.getAllItems(req.params.table);
                return res.status(200).json(items);
            } else {
                const item = await service.getItem(req.params.table, req.params);
                res.status(200).json(item);
            }
        } catch (error) {
            console.error("Error in getAllOrByValue:", error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getById: async (req, res) => {
        try {
            const item = await service.getItemById(req.params.table, req.params.id);
            res.status(200).json(item);
        } catch {
            res.status(500).json({ message: 'Server error' });
        }
    },

    getNested: async (req, res) => {
        try {
            const { baseTable, id, table } = req.params;
            const item = await service.getNestedItems(baseTable, id, table, req.query);
            res.status(200).json(item);
        } catch {
            res.status(500).json({ message: 'Server error' });
        }
    },

    post: async (req, res) => {
        try {
            const item = await service.createItem(req.params.table, req.body);
            res.status(201).json(item);
        } catch {
            res.status(500).json({ message: 'Server error' });
        }
    },

    update: async (req, res) => {
        try {
            const updated = await service.updateItemField(req.params.table, req.params.id, req.body);
            res.status(200).json(updated);
        } catch {
            res.status(500).json({ message: 'Server error' });
        }
    },

    softDelete: async (req, res) => {
        try {
            const deleted = await service.softDeleteItem(req.params.table, req.params.id);
            res.status(200).json(deleted);
        } catch {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default genericConterller;