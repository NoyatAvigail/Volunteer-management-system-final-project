import volunteerDAL from '../dal/volunteersDal.js';
import genericDAL from '../dal/genericDal.js';

const Volunteers = genericDAL.getModelByName("Volunteers");
const VolunteerTypes = genericDAL.getModelByName("VolunteerTypes");
const VolunteeringInDepartments = genericDAL.getModelByName("VolunteeringInDepartments");
const VolunteeringForSectors = genericDAL.getModelByName("VolunteeringForSectors");
const VolunteeringForGenders = genericDAL.getModelByName("VolunteeringForGenders");
const volunteerService = {
    getAllVolunteers: async () => {
        return await volunteerDAL.getAllVolunteers();
    },

    getVolunteerById: async (id) => {
        const volunteer = await volunteerDAL.getVolunteerById(id);
        if (!volunteer) throw { status: 404, message: 'Volunteer not found' };
        return volunteer;
    },

    createVolunteer: async (data) => {
        return await volunteerDAL.createVolunteer(data);
    },

    deleteVolunteer: async (id) => {
        const deleted = await volunteerDAL.softDeleteVolunteer(id);
        if (!deleted) throw { status: 404, message: 'Volunteer not found to delete' };
        return deleted;
    },

    // getVolunteerProfile: async (userId) => {
    //     const volunteer = await volunteerDAL.findVolunteerByUserId(userId);
    //     if (!volunteer) throw new Error("Volunteer not found");

    //     const volunteerId = volunteer.id;

    //     const [types, departments, sectors, genders] = await Promise.all([
    //         volunteerDAL.findVolunteerTypes(volunteerId),
    //         volunteerDAL.findVolunteerDepartments(volunteerId),
    //         volunteerDAL.findVolunteerSectors(volunteerId),
    //         volunteerDAL.findVolunteerGenders(volunteerId)
    //     ]);

    //     return {
    //         ...volunteer.toJSON(),
    //         VolunteerTypes: types.map(t => t.toJSON()),
    //         VolunteeringInDepartments: departments.map(d => d.toJSON()),
    //         VolunteeringForSectors: sectors.map(s => s.toJSON()),
    //         VolunteeringForGenders: genders.map(g => g.toJSON())
    //     };
    // },
    getVolunteerProfile: async (userId) => {
        // const id=userId.params.id;
        console.log("userId:", userId);

        const profile = await volunteerDAL.getFullVolunteerProfile(userId);

        if (!profile) throw new Error("Volunteer not found");
        return profile.toJSON();
    },


    // updateVolunteer: async (id, data) => {
    //     const updated = await volunteerDAL.updateVolunteerProfile(id, data);
    //     if (!updated) throw new Error("Volunteer not found for update");
    //     return { success: true };
    // },
    updateVolunteer: async (id, data) => {
    // המרה של שדות שמגיעים כמחרוזות למספרים
    const parsedData = {
        ...data,
        fullName: data.fullName?.trim(),
        flexible: data.isFlexible === "true" || data.flexible === true,
        helpTypes: (data.helpTypes || []).map(Number),
        preferredDepartments: (data.preferredDepartments || []).map(Number),
        preferredHospitals: (data.preferredHospitals || []).map(Number),
        guardSectors: (data.guardSectors || []).map(Number),
        guardGenders: (data.guardGenders || []).map(Number),
    };

    return await volunteerDAL.updateVolunteerProfile(id, parsedData);
},


    getShifts: async (volunteerId) => {
        return await volunteerDAL.getEventsByVolunteerId(volunteerId);
    },

    getOpenRequests: async (volunteerId) => {
        return volunteerId;

        // const volunteer = await Volunteers.findOne({ where: { id:volunteerId.id } });
        // if (!volunteer) throw new Error('Volunteer not found');

        // const preferences = await volunteerDAL.getVolunteerPreferences(volunteer.id);
        // const allOpenEvents = await volunteerDAL.getOpenEvents();

        // const matchingEvents = allOpenEvents.filter(event => {
        //     const hospitalMatch = preferences.departments.some(
        //         d => d.hospital === event.hospital && d.department === event.department
        //     );
        //     const genderMatch = preferences.genders.includes(event.gender);
        //     const sectorMatch = preferences.sectors.includes(event.sector);

        //     return hospitalMatch && genderMatch && sectorMatch;
        // });

        // return matchingEvents;
    },

    getCertificate: async (volunteerId) => {
        const events = await volunteerDAL.getEventsByVolunteerId(volunteerId);
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