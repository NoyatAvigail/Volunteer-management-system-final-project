import codeTablesDAL from '../dal/codeTablesDal.js';
let codeTablesCache = null;

const codeTablesServise = {
    loadCodeTables: async () => {
        const tables = ["UserTypes", "Sectors", "Genders", "Hospitals", "Departments", "FamilyRelations", "VolunteeringTypes"];
        const results = {};
        for (const table of tables) {
            try {
                const data = await codeTablesDAL.getTableData(table);
                results[table] = data;
            } catch (error) {
                console.error(`Error loading table ${table}:`, error);
                results[table] = [];
            }
        }
        codeTablesCache = results;
        console.log("Code Tables Cache Loaded");
    },

    getAllCodeTables: async () => {
        if (!codeTablesCache) {
            await codeTablesServise.loadCodeTables();
        }
        return codeTablesCache;
    }
}
export default codeTablesServise;