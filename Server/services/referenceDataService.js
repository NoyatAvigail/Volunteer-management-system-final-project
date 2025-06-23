import referenceDataDAL from '../dal/referenceDataDal.js';
let referenceDataCache = null;

const referenceDataServise = {
    loadReferenceData: async () => {
        const tables = ["UserTypes", "Sectors", "Genders", "Hospitals", "Departments", "FamilyRelations", "VolunteeringTypes"];
        const results = {};
        for (const table of tables) {
            try {
                const data = await referenceDataDAL.getTableData(table);
                results[table] = data;
            } catch (error) {
                console.error(`Error loading table ${table}:`, error);
                results[table] = [];
            }
        }
        referenceDataCache = results;
        console.log("Code Tables Cache Loaded");
    },

    getAllreferenceData: async () => {
        try {
            if (!referenceDataCache) {
                await referenceDataServise.loadReferenceData();
            }
            return referenceDataCache;
        } catch (error) {
            console.error("Failed to load code tables:", error);
            throw new Error("Could not retrieve code tables");
        }
    }
}
export default referenceDataServise;