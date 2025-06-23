import referenceDataService from '../services/referenceDataService.js';

const referenceDataController = {
    getAll: async (req, res) => {
        try {
            const referenceData = await referenceDataService.getAllreferenceData();
            res.status(200).json(referenceData);
        } catch (error) {
            console.error("Error in getreferenceData:", error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

export default referenceDataController;