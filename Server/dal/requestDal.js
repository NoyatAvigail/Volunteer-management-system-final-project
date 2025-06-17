import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';
import Events from '../Models/Events.js';
import Sectors from '../Models/Sectors.js';
import Genders from '../models/Genders.js';
import Hospitals from '../Models/Hospitals.js';
import Departments from '../Models/Departments.js';
import FamilyRelations from '../Models/FamilyRelations.js';
import VolunteeringTypes from '../Models/VolunteeringTypes.js';
import UserTypes from '../Models/UserTypes.js';
import Hospitalizeds from '../Models/Hospitalizeds.js'
import Volunteers from "../Models/Volunteers.js";
import ContactPeople from "../Models/ContactPeople.js";
import Patients from "../Models/Patients.js";
import RelationToPatients from "../Models/RelationToPatients.js";
import VolunteerTypes from "../Models/VolunteerTypes.js";
import VolunteeringInDepartments from "../Models/VolunteeringInDepartments.js";
import VolunteeringForSectors from "../Models/VolunteeringForSectors.js";
import VolunteeringForGenders from "../Models/VolunteeringForGenders.js";

const models = {
    Users, Passwords, Events, Sectors, Genders, Hospitals, Departments,
    FamilyRelations, VolunteeringTypes, UserTypes, Hospitalizeds, Volunteers,
    ContactPeople, Patients, RelationToPatients, VolunteerTypes,
    VolunteeringInDepartments, VolunteeringForSectors, VolunteeringForGenders
};
const requestDAL = {
    getContactPersonRequests: async (contact, asOfDate) => {

    },
    find: async (table1, targetField, table2, foreignKey, targetKey, targetValue) => {
        // find: async ()=>
        const matchingRecordsTbl1 = await genericDAL.findByField(
            genericDAL.getModelByName(table1),
            { [targetKey]: targetValue }
        );
        const parentIds = matchingRecordsTbl1.map(item => item[targetField]);
        const matchingRecordsTbl2 = await genericDAL.findByFieldIn(
            genericDAL.getModelByName(table2),
            foreignKey,
            parentIds
        );
        const req = userService.joinTables({
            parents: matchingRecordsTbl1,
            children: matchingRecordsTbl2,
            parentKey: targetField,
            childKey: foreignKey,
            parentPrefix: ""
        });
        const distinctPatientIds = [...new Set(req.map(item => item.patientId))];
        const patients = await genericDAL.findByFieldIn(
            genericDAL.getModelByName("Patients"),
            "userId",
            distinctPatientIds
        );
        const req2 = userService.joinTables({
            parents: req,
            children: patients,
            parentKey: "patientId",
            childKey: "userId",
            parentPrefix: ""
        });
        return req2;
    }
}