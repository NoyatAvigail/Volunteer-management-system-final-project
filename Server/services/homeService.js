import homeDal from '../dal/homeDal.js';

// const homeService = {
//     async gethome() {
//         const [volunteerCount, totalHours] = await Promise.all([
//             homeDal.countActiveVolunteers(),
//             homeDal.sumVolunteerHours(),
//         ]);
//         return {
//             volunteerCount,
//             totalHours,
//         };
//     }
// };

// export default homeService;
const homeService = {
    async gethome() {
        const [volunteerCount, totalHours, hospitalCount, departmentCount] = await Promise.all([
            homeDal.countActiveVolunteers(),
            homeDal.sumVolunteerHours(),
            homeDal.countActiveHospitals(),
            homeDal.countActiveDepartments()
        ]);

        return {
            volunteerCount,
            totalHours,
            hospitalCount,
            departmentCount
        };
    }
};

export default homeService;