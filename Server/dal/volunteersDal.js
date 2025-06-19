import Events from "../models/Events.js";
const volunteerDAL = {
  getEventsByVolunteerId: async (volunteerId) => {
    return await Events.findAll({
      where: {
        volunteerId,
        is_deleted: 0
      }
    });
  },
};
export default volunteerDAL;