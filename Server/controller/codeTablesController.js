import codeTablesService from '../services/codeTablesService.js';

export const getCodeTables = async (req, res) => {
    try {
        const codeTables = await codeTablesService.getAllCodeTables();
        res.status(200).json(codeTables);
    } catch (error) {
        console.error("Error in getCodeTables:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
