import service from "../services/requestsService.js";

const requestsController = {
    // GET /api/requests?contactPerson=123
    getContactRequests: async (contact, asOfDate) => {
        const { contact, asOfDate } = req.query;
        try {
            const items = await service.getAllItems(req.params.table);
            res.status(200).json(items);
        } catch (error) {
            console.error("Error in getAll:", error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
};

export default genericConterller;