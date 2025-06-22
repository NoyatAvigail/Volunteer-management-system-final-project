import { Patients, Hospitalizeds, Events, ContactPeople } from '../../DB/index.mjs';

const volunteerDAL = {
  getEventsByVolunteerId: async (userId) => {
    console.log("הגיע לדאל");

    // return await Events.findAll({
    //   where: {
    //     volunteerId:userId,
    //     is_deleted: 0
    //   }, 
    // });
    const volunteer = await Events.findAll({
      where: {
        volunteerId: userId,
        is_deleted: 0
      },
      include: [
        {
          model: ContactPeople,
        },
        {
          model: Hospitalizeds,
          include: [
            {
              model: Patients,
            }
          ]
        }
      ]
    });

    console.log("volunteer:", volunteer);
    return volunteer;
  },
};
export default volunteerDAL;