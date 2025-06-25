import hospitalizedsDal from "../dal/hospitalizedsDal.js";

const hospitalizedsService = {
    utils: async (authenticatedType) => {
        const type = genericDAL.getModelByName('UserTypes');
        const userType = await genericDAL.findById(type, authenticatedType);
        const userTypeDesc = userType?.description;
        const model = genericDAL.getModelByName('ContactPeople');
        return { userTypeDesc, model };
    },

    getHospitalizeds: async (authenticatedId, patientId) => {
        try {
            return await hospitalizedsDal.getHospitalizeds(patientId);
        } catch (error) {
            console.error("Error in hospitalizedsService.getHospitalizeds:", error);
            throw error;
        }
    },

    createHospitalized: async (authenticatedId, body) => {
        try {
            const patientId = body.patientId;
            return await hospitalizedsDal.createHospitalized(patientId, body);
        } catch (error) {
            console.error("Error in hospitalizedsService.createHospitalized:", error);
            throw error;
        }
    },
}
export default hospitalizedsService;