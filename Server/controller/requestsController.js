import requestsService from "../services/requestsService.js";

const requestsController = {
    // GET /api/requests?contactPerson=123
    // GET /api/requests?volunteer=123
    getRequests: async (req, res) => {
        const { startDate, endDate } = req.query;
        const authenticatedId = req.user.id.toString();
        const authenticatedType = req.user.type.toString();
        try {
            const requests = await requestsService.getRequests(startDate, endDate, authenticatedId, authenticatedType);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in getContactRequests Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

export default requestsController;