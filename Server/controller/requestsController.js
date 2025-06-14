import service from "../services/requestsService.js";

const genericConterller = {
    getAll: async (req, res) => {
        try {
            const items = await service.getAllItems(req.params.table);
            res.status(200).json(items);
        } catch (error) {
            console.error("Error in getAll:", error);
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

    post: async (req, res) => {
        try {
            const item = await service.create(req.params.table, req.body);
            res.status(201).json(item);
        } catch (err) {
            console.error("Error in POST /:table:", err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    update: async (req, res) => {
        try {
            const updated = await service.update(req.params.table, req.params.id, req.body);
            res.status(200).json(updated);
        } catch {
            res.status(500).json({ message: 'Server error' });
        }
    },

    softDelete: async (req, res) => {
        try {
            const deleted = await service.softDelete(req.params.table, req.params.id);
            res.status(200).json(deleted);
        } catch {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default genericConterller;