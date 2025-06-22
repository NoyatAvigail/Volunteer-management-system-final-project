import Events from "../models/Events.js";

const volunteerDAL = {
  getEventsByVolunteerId: async (userId) => {   
    console.log("הגיע לדאל");
     
    return await Events.findAll({
      where: {
        volunteerId:userId,
        is_deleted: 0
      }
    });
  },
};
export default volunteerDAL;