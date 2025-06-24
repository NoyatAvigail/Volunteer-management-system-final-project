import genericDAL from "../dal/genericDal.js";

const genericService = {
    utils: async (authenticatedType) => {
        try {
            const type = genericDAL.getModelByName('UserTypes');
            const userType = await genericDAL.findById(type, authenticatedType);
            const userTypeDesc = userType?.description;
            const model = userTypeDesc === 'Volunteer'
                ? genericDAL.getModelByName('Volunteers')
                : genericDAL.getModelByName('ContactPeople');
            return { userTypeDesc, model };
        } catch (error) {
            console.error("Error in utils:", error);
            throw error;
        }
    },
};

export default genericService;