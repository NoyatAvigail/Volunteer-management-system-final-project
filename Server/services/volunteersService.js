import volunteerDAL from '../dal/volunteersDal.js';
import genericDAL from '../dal/genericDal.js';

const volunteerService = {
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

    getShifts: async (authenticatedId, authenticatedType) => {
        try {
            const volunteer = genericDAL.getModelByName('Volunteers');
            const user = await genericDAL.findById(volunteer, authenticatedId);
            if (!user) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            const userIdFromToken = user.userId;
            return await volunteerDAL.getEventsByVolunteerId(userIdFromToken);
        } catch (error) {
            console.error("Error in getShifts:", error);
            throw error;
        }
    },

    getCertificate: async (authenticatedId) => {
        try {
            const volunteer = genericDAL.getModelByName('Volunteers');
            const user = await genericDAL.findById(volunteer, authenticatedId);
            if (!user) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }

            const events = await volunteerDAL.getEventsByVolunteerId(user.userId);
            
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
        } catch (error) {
            console.error("Error in getCertificate:", error);
            throw error;
        }
    }
};

export default volunteerService;