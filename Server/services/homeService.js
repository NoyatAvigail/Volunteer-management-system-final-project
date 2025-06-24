import homeDal from '../dal/homeDal.js';

const homeService = {
    async gethome() {
        const [volunteerCount, totalHours, hospitalCount, departmentCount, thanksNotes] = await Promise.all([
            homeDal.countActiveVolunteers(),
            homeDal.sumVolunteerHours(),
            homeDal.countActiveHospitals(),
            homeDal.countActiveDepartments(),
            homeDal.getAllThanksNotes()
        ]);

        return {
            volunteerCount,
            totalHours,
            hospitalCount,
            departmentCount,
            thanksNotes
        };
    }
};

export default homeService;