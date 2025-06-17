import requestsService from "../services/requestsService.js";

const requestsController = {
    // GET /api/requests?contactPerson=123
    getContactRequests: async (req, res) => {
        const { contact, startDate, endDate } = req.query;
        // const authenticatedId = req.header.authorization.id.toString();
        const authenticatedId = '61227757'
        try {
            const requests = await requestsService.getContactRequests(contact, startDate, endDate, authenticatedId);
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