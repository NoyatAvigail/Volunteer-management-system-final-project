import genericDAL from "../dal/genericDal.js";
import requestsDal from "../dal/requestsDal.js";
import emailsService from "./emailsService.js";
import genericService from '../services/genericService.js'

const requestService = {
  getRequests: async (authenticatedId, authenticatedType, startDate, endDate) => {
    try {
      const utils = await genericService.utils(authenticatedType);
      const users = await genericDAL.findByField(utils.model, { id: authenticatedId });
      const user = users[0];
      if (!user) {
        const error = new Error(`User not found`);
        error.status = 404;
        throw error;
      }
      const userIdFromToken = user.userId;
      const requests = utils.userTypeDesc == 'Volunteer'
        ? await requestService.getVolunteerRequests(userIdFromToken)
        : await requestService.getContactRequests(userIdFromToken, startDate, endDate);
      return requests;
    } catch (error) {
      console.error("Error in getRequests:", error);
      throw error;
    }
  },

  getVolunteerRequests: async (userId) => {
    const sameDay = (d1, d2) => {
      const date1 = new Date(d1);
      const date2 = new Date(d2);
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    const volunteer = await requestsDal.getVolunteerByUserId(userId);
    if (!volunteer) throw new Error("Volunteer not found");

    const preferredGenders = volunteer.VolunteeringForGenders?.map(g => g.genderId) || [];
    const preferredSectors = volunteer.VolunteeringForSectors?.map(s => s.sectorId) || [];
    const preferredHospitalsDepartments = volunteer.VolunteersDepartments?.map(d => ({
      hospital: d.hospital,
      department: d.department,
    })) || [];

    const takenEvents = await requestsDal.getEventsOfVolunteer(volunteer.userId);
    const takenDates = takenEvents.map(e => new Date(e.date));

    const allOpenEvents = await requestsDal.getFutureOpenEvents();

    const filteredEvents = allOpenEvents.filter(evt => {
      const evtDate = new Date(evt.date);

      const alreadyTakenThatDay = takenDates.some(d => sameDay(d, evtDate));
      if (alreadyTakenThatDay) return false;

      const hosp = evt.Hospitalized?.Hospital?.id;
      const dept = evt.Hospitalized?.Department?.id;
      const sect = evt.Hospitalized?.Patient?.sector;
      const gend = evt.Hospitalized?.Patient?.gender;

      const matchesHospitalDept = preferredHospitalsDepartments.length === 0 ||
        preferredHospitalsDepartments.some(p => p.hospital === hosp && p.department === dept);
      const matchesGender = preferredGenders.map(g => String(g)).includes(String(gend));
      const matchesSector = preferredSectors.map(s => String(s)).includes(String(sect));

      return matchesHospitalDept && matchesGender && matchesSector;
    });

    return filteredEvents;
  },

  getContactRequests: async (userIdFromToken, startDate, endDate) => {
    try {
      const events = await requestsDal.getContactRequests(userIdFromToken, startDate, endDate);
      return events;
    } catch (error) {
      console.error("Error in getContactRequests:", error);
      throw error;
    }
  },

  createRequest: async (body, authenticatedId, authenticatedType) => {
    try {
      const userUtils = await genericService.utils(authenticatedType);
      const user = await genericDAL.findById(userUtils.model, authenticatedId);
      if (!user) {
        const error = new Error(`User not found`);
        error.status = 404;
        throw error;
      }
      const userIdFromToken = user.userId;
      if (userUtils.userTypeDesc !== 'ContactPerson') {
        const error = new Error('Only ContactPeople can create requests');
        error.status = 403;
        throw error;
      }
      const newEvent = await requestsDal.createEvent({ ...body, contactId: userIdFromToken });
      return newEvent;
    } catch (error) {
      console.error("Error in createRequests:", error);
      throw error;
    }
  },

  deleteRequest: async (authenticatedId, authenticatedType, eventId) => {
    try {
      const userUtils = await genericService.utils(authenticatedType);
      if (userUtils.userTypeDesc == 'ContactPerson') {
        const result = await requestsDal.softDeleteRequests(eventId);
        if (result.volunteerId != null) {
          const volunteerEmailData = {
            volunteerName: result.Volunteer.fullName,
            date: result.date,
            startTime: result.startTime,
            endTime: result.endTime,
            hospital: result.Hospitalized?.Hospital?.description,
            department: result.Hospitalized?.Department?.description,
            room: result.Hospitalized?.roomNumber,
            patientName: result.Hospitalized?.Patient?.fullName,
          }
          const event = await emailsService.sendVolunteerShiftCancellationEmail(result.Volunteer.User.email, volunteerEmailData);
        } return result;
      } else {
        const error = new Error("Unauthorized to delete");
        error.status = 403;
        throw error;
      }
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      throw error;
    }
  },

  updatRequest: async (body, authenticatedId, authenticatedEmail, authenticatedType, eventId) => {
    try {
      const utils = await genericService.utils(authenticatedType);
      const users = await genericDAL.findByField(utils.model, { id: authenticatedId });
      const user = users[0];
      if (!user) {
        const error = new Error(`${authenticatedType} with id ${authenticatedId} not found`);
        error.status = 404;
        throw error;
      }
      const userIdFromToken = user.userId;

      if (utils.userTypeDesc === 'Volunteer') {
        const event = await requestsDal.assignVolunteerToEvent(eventId, userIdFromToken);
        const volunteerEmailData = {
          volunteerName: event.Volunteer.fullName,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          hospital: event.Hospitalized?.Hospital?.description,
          department: event.Hospitalized?.Department?.description,
          room: event.Hospitalized.roomNumber,
          patientName: event.Hospitalized?.Patient?.fullName,
        };

        const contactEmailData = {
          contactName: event.ContactPerson.fullName,
          volunteerName: event.Volunteer.fullName,
          volunteerPhone: event.Volunteer.User.phone,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
        };

        await emailsService.sendVolunteerAssignmentEmail(authenticatedEmail, volunteerEmailData);
        await emailsService.sendContactNotificationEmail(event.ContactPerson.User.email, contactEmailData);

        return event;
      }
      else {
        const fullEvent = await requestsDal.updateEventDetails(eventId, body);
        const emailData = {
          volunteerName: fullEvent.Volunteer.fullName,
          date: fullEvent.date,
          startTime: fullEvent.startTime,
          endTime: fullEvent.endTime,
          hospital: fullEvent.Hospitalized?.Hospital?.description,
          department: fullEvent.Hospitalized?.Department?.description,
          room: fullEvent.Hospitalized?.roomNumber,
          patientName: fullEvent.Hospitalized?.Patient?.fullName,
          contactName: fullEvent.ContactPerson?.fullName,
          contactEmail: fullEvent.ContactPerson?.User?.email,
          contactPhone: fullEvent.ContactPerson?.User?.phone,
        };

        await emailsService.sendVolunteerShiftUpdatedEmail(fullEvent.Volunteer.User.email, emailData);
      }
    } catch (error) {
      console.error("Error in updatRequests:", error);
      throw error;
    }
  }
};

export default requestService;