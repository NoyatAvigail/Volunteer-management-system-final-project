import { Op } from 'sequelize';
import {
  Users,
  Passwords,
  Events,
  Sectors,
  Genders,
  Hospitals,
  Departments,
  FamilyRelations,
  VolunteeringTypes,
  UserTypes,
  Hospitalizeds,
  Volunteers,
  ContactPeople,
  Patients,
  RelationToPatients,
  VolunteerTypes,
  VolunteeringInDepartments,
  VolunteeringForSectors,
  VolunteeringForGenders
} from '../../DB/index.mjs';
import moment from 'moment';
import { Sequelize } from 'sequelize';

const models = {
  Users, Passwords, Events, Sectors, Genders, Hospitals, Departments,
  FamilyRelations, VolunteeringTypes, UserTypes, Hospitalizeds, Volunteers,
  ContactPeople, Patients, RelationToPatients, VolunteerTypes,
  VolunteeringInDepartments, VolunteeringForSectors, VolunteeringForGenders
};

const requestDal = {
getContactRequests: async (contactId, startDate, endDate) => {
    const formattedStart = moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const formattedEnd = moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const events = await Events.findAll({
      where: {
        contactId,
        date: {
          [Sequelize.Op.between]: [formattedStart, formattedEnd]
        },
        is_deleted: 0
      },
      include: [
        {
          model: Hospitalizeds,
          attributes: ['hospital', 'department', 'patientId', 'roomNumber'],
          include: [
            { model: Hospitals, attributes: ['id', 'description'] },
            { model: Departments, attributes: ['id', 'description'] },
            { model: Patients, attributes: ['id', 'userId', 'fullName'] }
          ]
        },
        {
          model: Volunteers,
          attributes: ['userId', 'fullName'],
          include: [
            { model: Users, attributes: ['phone', 'email'] }
          ],
          required: false
        }
      ]
    });

    return events;
  },

  getVolunteerRequests: async (userId) => {
    const volunteer = await Volunteers.findOne({
      where: { userId, is_deleted: 0 },
      include: [
        { model: VolunteeringInDepartments },
        { model: VolunteeringForSectors },
        { model: VolunteeringForGenders }
      ]
    });
    if (!volunteer) throw new Error("Volunteer not found");
    const preferredGenders = volunteer.VolunteeringForGenders?.map(g => g.genderId) || [];
    const preferredSectors = volunteer.VolunteeringForSectors?.map(s => s.sectorId) || [];
    const preferredHospitalsDepartments = volunteer.VolunteersDepartments?.map(d => ({
      hospital: d.hospital,
      department: d.department
    })) || [];
    const events = await Events.findAll({
      where: {
        date: {
          [Op.gt]: new Date()
        },
        volunteerId: null,
        is_deleted: 0
      },
      include: [
        {
          model: Hospitalizeds,
          include: [
            {
              model: Hospitals,
            },
            {
              model: Departments,
            },
            {
              model: Patients,
            }
          ]
        }
      ]
    });
    const filtered = events.filter(event => {
      const hosp = event.Hospitalized?.Hospital;
      const dept = event.Hospitalized?.Department;
      return preferredHospitalsDepartments.some(pref =>
        pref.hospital === hosp?.id && pref.department === dept?.id
      );
    });
    return filtered;
  },

  findRequests: async (hospital, department, startDate, endDate) => {
    const filters = {
      date: {
        [Op.between]: [startDate, endDate]
      },
      is_deleted: 0
    };
    const include = [
      {
        model: Hospitalizeds,
        include: [
          {
            model: Hospitals,
            attributes: ['description'],
            ...(hospital && { where: { id: hospital } })
          },
          {
            model: Departments,
            attributes: ['description'],
            ...(department && { where: { id: department } })
          },
          {
            model: Patients,
            attributes: ['userId', 'fullName', 'hospital', 'department']
          }
        ]
      }
    ];
    const events = await Events.findAll({
      where: filters,
      include: include
    });
  },

  createEvent: async (eventData) => {
    try {
      const newEvent = await Events.create(eventData);
      return newEvent;
    } catch (error) {
      console.error("Error creating Event:", error);
      throw error;
    }
  },

  assignVolunteerToEvent: async (eventId, volunteerId) => {
    await Events.update({ volunteerId }, { where: { id: eventId } });
    const event = await Events.findByPk(eventId, {
      include: [
        {
          model: Volunteers,
          attributes: ['fullName'],
          include: [{ model: Users, attributes: ['email', 'phone'] }]
        },
        {
          model: Hospitalizeds,
          attributes: ['roomNumber'],
          include: [{ model: Patients, attributes: ['fullName'] },
          { model: Departments, attributes: ['description'] },
          { model: Hospitals, attributes: ['description'] },
          ]
        },
        {
          model: ContactPeople,
          attributes: ['fullName'],
          include: [{ model: Users, attributes: ['email', 'phone'] }]
        }
      ]
    });
    return event;
  },

  getFullEventById: async (eventId) => {
    return await Events.findByPk(eventId, {
      include: [
        {
          model: Volunteers,
          include: [Users]
        },
        {
          model: Hospitalizeds,
          include: [Hospitals, Departments, Patients]
        },
        {
          model: ContactPeople,
          include: [Users]
        }
      ]
    });
  },

  updateEventDetails: async (eventId, updatedFields) => {
    const event = await Events.findByPk(eventId);
    if (!event) throw new Error("Event not found");
    Object.assign(event, updatedFields);
    await event.save();
    return await requestDal.getFullEventById(eventId);
  },

  softDeleteRequests: async (eventId) => {
    Events.update(
      { is_deleted: 1 },
      { where: { id: eventId } })
      return requestDal.getFullEventById(eventId)
  }
}

export default requestDal;
