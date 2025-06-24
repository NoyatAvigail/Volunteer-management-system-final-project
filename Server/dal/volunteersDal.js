import { Patients, Hospitalizeds, Events, ContactPeople, Hospitals, Departments, Users } from '../../DB/index.mjs';

const volunteerDAL = {
  getEventsByVolunteerId: async (userId) => {
    const volunteer = await Events.findAll({
      where: {
        volunteerId: userId,
        is_deleted: 0
      },
      include: [
        {
          model: ContactPeople,
          include: [
            {
              model: Users,
            },]
        },
        {
          model: Hospitalizeds,
          include: [
            { model: Hospitals },
            { model: Departments },
            {
              model: Patients,
            }
          ]
        }
      ]
    });
    return volunteer;
  },
};
export default volunteerDAL;