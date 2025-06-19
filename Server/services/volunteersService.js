import volunteerDAL from '../dal/volunteersDal.js';
import genericDAL from '../dal/genericDal.js';

const volunteerService = {
    utils: async (authenticatedId) => {
        const Volunteeers = genericDAL.getModelByName('Volunteeers');
        const volunteer = await genericDAL.findById(Volunteeers, authenticatedId);
        const volnteerId = volunteer.id;
        return volnteerId;
    },

    getShifts: async (authenticatedId) => {
        const utils = utils(authenticatedId);
        return await volunteerDAL.getEventsByVolunteerId(utils.volnteerId);
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