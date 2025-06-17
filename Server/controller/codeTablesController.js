import codeTablesService from '../services/codeTablesService.js';

const codeTablesController = {
    getAll: async (req, res) => {
        try {
            const codeTables = await codeTablesService.getAllCodeTables();
            res.status(200).json(codeTables);
        } catch (error) {
            console.error("Error in getCodeTables:", error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

export default codeTablesController;