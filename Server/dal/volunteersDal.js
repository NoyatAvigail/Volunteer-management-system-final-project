import genericDAL from './genericDal.js';
import { Users, Volunteers, VolunteerTypes, VolunteeringForGenders, VolunteeringForSectors, VolunteeringInDepartments } from '../../DB/index.mjs'
const TABLE = 'Volunteers';
const volunteerDAL = {
  getModel: () => genericDAL.getModelByName(TABLE),
  getEventsByVolunteerId: async (volunteerId) => {

    return await Events.findAll({ where: { volunteerId } });
  },
  // updateVolunteerProfile: async (id, data) => {
  //   console.log("data:", data);

  //   const [rowsUpdated, [volunteer]] = await Volunteers.update({
  //     fullName: data.fullName,
  //     dateOfBirth: data.dateOfBirth,
  //     gender: data.gender,
  //     sector: data.sector,
  //     address: data.address,
  //     volunteerStartDate: data.volunteerStartDate,
  //     volunteerEndDate: data.volunteerEndDate,
  //     isActive: data.isActive,
  //     flexible: data.flexible,
  //   }, {
  //     where: { id },
  //     returning: true,
  //   });

  //   if (!rowsUpdated) return null;

  //   const volunteerId = volunteer.id;

  //   // helper for replace many-to-many
  //   const replaceManyToMany = async (model, idField, values, valueFieldName = idField) => {
  //     await model.destroy({ where: { [idField]: volunteerId } });
  //     if (values?.length) {
  //       const rows = values.map(value => ({ [idField]: volunteerId, [valueFieldName]: value }));
  //       await model.bulkCreate(rows);
  //     }
  //   };

  //   await replaceManyToMany(VolunteerTypes, 'id', data.helpTypes, 'volunteerTypeId');
  //   await replaceManyToMany(VolunteeringForSectors, 'volunteerId', data.guardSectors, 'sectorId');
  //   await replaceManyToMany(VolunteeringForGenders, 'volunteerId', data.guardGenders, 'genderId');

  //   // VolunteeringInDepartments - עם לולאה משולבת
  //   await VolunteeringInDepartments.destroy({ where: { volunteerId } });
  //   const departments = [];
  //   for (const hospitalId of data.preferredHospitals || []) {
  //     for (const departmentId of data.preferredDepartments || []) {
  //       departments.push({ volunteerId, department: departmentId, hospital: hospitalId });
  //     }
  //   }
  //   if (departments.length) {
  //     await VolunteeringInDepartments.bulkCreate(departments);
  //   }

  //   return volunteer;
  // },
  updateVolunteerProfile: async (userId, data) => {
    const volunteer = await Volunteers.findOne({ where: { userId } });
    const Volunteer = await genericDAL.update(Volunteers, volunteer.id, {
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      sector: data.sector,
      address: data.address,
      volunteerStartDate: data.volunteerStartDate,
      volunteerEndDate: data.volunteerEndDate,
      isActive: data.isActive,
      flexible: data.flexible
    });
    genericDAL.deleteByField(VolunteerTypes, Volunteer.id)
    genericDAL.deleteByField(VolunteeringForGenders, Volunteer.id)
    genericDAL.deleteByField(VolunteeringForSectors, Volunteer.id)
    genericDAL.deleteByField(VolunteeringInDepartments, Volunteer.id)

    const helpTypes = data.helpTypes.map(typeId => ({
      id: Volunteer.id,
      volunteerTypeId: typeId
    }));

    if (helpTypes.length)
      await genericDAL.bulkCreateModel(VolunteerTypes, helpTypes);
    const departments = [];
    for (const hospitalId of data.preferredHospitals) {
      for (const departmentId of data.preferredDepartments) {
        departments.push({
          id: Volunteer.id,
          department: departmentId,
          hospital: hospitalId
        });
      }
    }
    if (departments.length)
      await genericDAL.bulkCreateModel(VolunteeringInDepartments, departments);
    const sectors = data.guardSectors.map(sectorId => ({
      id: Volunteer.id,
      sectorId
    }));
    if (sectors.length)
      await genericDAL.bulkCreateModel(VolunteeringForSectors, sectors);

    const genders = data.guardGenders.map(genderId => ({
      id: Volunteer.id,
      genderId
    }));
    if (genders.length)
      await genericDAL.bulkCreateModel(VolunteeringForGenders, genders);
    return Volunteer;
  },

  getOpenEvents: async () => {
    return await Events.findAll({ where: { volunteerId: null } });
  },

  getVolunteerPreferences: async (volunteerId) => {
    const [departments, sectors, genders] = await Promise.all([
      VolunteeringInDepartments.findAll({ where: { id: volunteerId } }),
      VolunteeringForSectors.findAll({ where: { id: volunteerId } }),
      VolunteeringForGenders.findAll({ where: { id: volunteerId } }),
    ]);

    return {
      departments: departments.map(d => ({ hospital: d.hospital, department: d.department })),
      sectors: sectors.map(s => s.sectorId),
      genders: genders.map(g => g.genderId),
    };
  },

  getAllVolunteers: async () => {
    const model = getModel();
    return await genericDAL.findAll(model);
  },

  getVolunteerById: async (id) => {
    const model = getModel();
    const results = await genericDAL.findByField(model, { id });
    return results[0] || null;
  },

  createVolunteer: async (data) => {
    const model = getModel();
    return await genericDAL.createModel(model, data);
  },

  // updateVolunteer: async (id, data) => {
  //   const model = getModel();
  //   return await genericDAL.updateByField(model, { id }, data);
  // },
  getFullVolunteerProfile: async (userId) => {
    return Volunteers.findOne({
      where: { userId, is_deleted: 0 },
      include: [
        { model: Users },
        { model: VolunteerTypes },
        { model: VolunteeringInDepartments },
        { model: VolunteeringForSectors },
        { model: VolunteeringForGenders }
      ]
    });
  },


  softDeleteVolunteer: async (id) => {
    const model = getModel();
    return await genericDAL.updateFields(model, { id }, {
      is_deleted: 1,
      deleted_at: new Date()
    });
  }
};
export default volunteerDAL;