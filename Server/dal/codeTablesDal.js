import genericDAL from './genericDal.js';

const codeTablesDal = {
    getTableData: async (tableName) => {
        const model = genericDAL.getModelByName(tableName);
        const data = await genericDAL.findAll(model);
        return data;
    }
}

export default codeTablesDal;