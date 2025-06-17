import Users from '../models/Users.js';
import Passwords from '../models/Passwords.js';
import Events from '../models/Events.js';
import Sectors from '../models/Sectors.js';
import Genders from '../models/Genders.js';
import Hospitals from '../models/Hospitals.js';
import Departments from '../models/Departments.js';
import FamilyRelations from '../models/FamilyRelations.js';
import VolunteeringTypes from '../models/VolunteeringTypes.js';
import UserTypes from '../models/UserTypes.js';
import Hospitalizeds from '../models/Hospitalizeds.js'
import Volunteers from "../models/Volunteers.js";
import ContactPeople from "../models/ContactPeople.js";
import Patients from "../models/Patients.js";
import RelationToPatients from "../models/RelationToPatients.js";
import VolunteerTypes from "../models/VolunteerTypes.js";
import VolunteeringInDepartments from "../models/VolunteeringInDepartments.js";
import VolunteeringForSectors from "../models/VolunteeringForSectors.js";
import VolunteeringForGenders from "../models/VolunteeringForGenders.js";

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