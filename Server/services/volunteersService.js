import volunteerDAL from '../dal/volunteersDal.js';
import genericDAL from '../dal/genericDal.js';

const volunteerService = {
    utils: async (authenticatedType) => {
        const type = genericDAL.getModelByName('UserTypes');
        const userType = await genericDAL.findById(type, authenticatedType);
        const userTypeDesc = userType?.description;
        const model = userTypeDesc === 'Volunteer'
            ? genericDAL.getModelByName('Volunteers')
            : genericDAL.getModelByName('ContactPeople');
        return { userTypeDesc, model };
    },

    getShifts: async (authenticatedId, authenticatedType) => {
        console.log("סרביסז");
        
        const { model } = await profilesService.utils(authenticatedType);
        const user = await genericDAL.findById(model, authenticatedId);
        if (!user) {
            const error = new Error(`User not found`);
            error.status = 404;
            throw error;
        }
        const userIdFromToken = user.userId;
        return await volunteerDAL.getEventsByVolunteerId(userIdFromToken);
    },

    getCertificate: async (authenticatedId) => {
        const utils = utils(authenticatedId);
        const events = await volunteerDAL.getEventsByVolunteerId(utils.volnteerId);
        let totalMinutes = 0;

        events.forEach(event => {
            const start = new Date(`1970-01-01T${event.startTime}Z`);
            const end = new Date(`1970-01-01T${event.endTime}Z`);
            const diff = (end - start) / 60000;
            totalMinutes += diff;
        });

        return {
            totalHours: Math.floor(totalMinutes / 60),
            totalMinutes: totalMinutes % 60,
            eventCount: events.length,
        };
    },
}
export default volunteerService;