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

import { Sequelize } from 'sequelize';

const models = {
  Users, Passwords, Events, Sectors, Genders, Hospitals, Departments,
  FamilyRelations, VolunteeringTypes, UserTypes, Hospitalizeds, Volunteers,
  ContactPeople, Patients, RelationToPatients, VolunteerTypes,
  VolunteeringInDepartments, VolunteeringForSectors, VolunteeringForGenders
};

const requestDal = {
  getContactRequests: async (contactId, startDate, endDate) => {
    console.log(Events.associations);
    const events = await Events.findAll({
      where: {
        contactId: contactId,
        date: {
          [Sequelize.Op.between]: [startDate, endDate]
        },
        is_deleted: 0
      },
      include: [
        {
          model: Hospitalizeds,
          attributes: ['hospital', 'department', 'patientId', 'roomNumber'],
          include: [
            {
              model: Hospitals,
              attributes: ['id', 'description']
            },
            {
              model: Departments,
              attributes: ['id', 'description']
            },
            {
              model: Patients,
              attributes: ['id', 'userId', 'fullName']
            }
          ]
        }
      ]
    });
    console.log(events);
    return events;
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
  }
  // find: async (table1, targetField, table2, foreignKey, targetKey, targetValue) => {
  //   const matchingRecordsTbl1 = await genericDAL.findByField(
  //     genericDAL.getModelByName(table1),
  //     { [targetKey]: targetValue }
  //   );
  //   const parentIds = matchingRecordsTbl1.map(item => item[targetField]);
  //   const matchingRecordsTbl2 = await genericDAL.findByFieldIn(
  //     genericDAL.getModelByName(table2),
  //     foreignKey,
  //     parentIds
  //   );
  //   const req = userService.joinTables({
  //     parents: matchingRecordsTbl1,
  //     children: matchingRecordsTbl2,
  //     parentKey: targetField,
  //     childKey: foreignKey,
  //     parentPrefix: ""
  //   });
  //   const distinctPatientIds = [...new Set(req.map(item => item.patientId))];
  //   const patients = await genericDAL.findByFieldIn(
  //     genericDAL.getModelByName("Patients"),
  //     "userId",
  //     distinctPatientIds
  //   );
  //   const req2 = userService.joinTables({
  //     parents: req,
  //     children: patients,
  //     parentKey: "patientId",
  //     childKey: "userId",
  //     parentPrefix: ""
  //   });
  //   return req2;
  // }
}

export default requestDal;