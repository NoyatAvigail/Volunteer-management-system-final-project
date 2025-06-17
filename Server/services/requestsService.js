import genericDAL from "../dal/genericDal.js"
import { log } from "../utils/logger.js";
import Users from '../models/Users.js';
import Passwords from '../models/Passwords.js';
import ContactPeople from "../models/ContactPeople.js"
import Patients from "../models/Patients.js"
import RelationToPatients from '../models/RelationToPatients.js'
import Hospitalizeds from '../models/Hospitalizeds.js';
import { cUserType } from '../common/consts.js'
import sequelize from '../../DB/connectionDB.mjs';
import requestDal from "../dal/requestDal.js"

const requestService = {
    create: async (data) => {
        const transaction = await sequelize.transaction();
        try {
            // CheckPatient if not exists throw exception
            let checkIfPatientsExists = await genericDAL.findById(Patients, data.patientId);
            if (!checkIfPatientsExists)
                throw new Error("patient not exists");
            //CheckHospitilized if exists with other details - > question??
            let checkIfHospitailizedExists = await genericDAL.findById(Hospitalizeds, data.hospitalizedsId);
            //addrequesst

            let newRequest = await genericDAL.createModel(Users, { email, type, phone, id }, { transaction });
            const hashed = await hashPassword(password);
            const pwd = await genericDAL.createModel(Passwords, {
                id: newUser.id,
                password: hashed
            }, { transaction });

            if (type == cUserType.CONTACTPERSON) {
                const contact = await genericDAL.createModel(ContactPeople,
                    {
                        userId: newUser.id,
                        fullName: rest.fullName,
                        address: rest.address
                    }, { transaction });
                //TODO check if patient exists, if not then create
                const patient = await genericDAL.createModel(Patients,
                    {
                        userId: rest.patientId,
                        contactPeopleId: contact.id,
                        fullName: rest.patientFullName,
                        dateOfBirth: rest.patientDateOfBirth,
                        sector: rest.patientSector,
                        gender: rest.patientGender,
                        address: rest.patientAddress,
                        dateOfDeath: rest.patientDateOfDeath || null,
                        interestedInReceivingNotifications: rest.patientInterestedInReceivingNotifications ?? true
                    }, { transaction });

                const relationToPatients = await genericDAL.createModel(RelationToPatients,
                    {
                        contactPeopleId: contact.id,
                        patientId: patient.id,
                        relationId: rest.relationId,
                    }, { transaction });
                //TODO check if hospitalized exists, if exists then popup check to user, else create 
                const hospitalizeds = await genericDAL.createModel(Hospitalizeds,
                    {
                        patientId: patient.id,
                        hospital: rest.hospital,
                        department: rest.department,
                        roomNumber: rest.roomNumber,
                        hospitalizationStart: rest.hospitalizationStart,
                        hospitalizationEnd: rest.hospitalizationEnd
                    }, { transaction });

                newUser = {
                    ...rest,
                    type: type,
                    id: contact.id,
                    autoId: contact.id
                };
            }

            await transaction.commit();
            return newUser;

        } catch (e) {
            await transaction.rollback();
            console.error("Signup failed:", e);
            throw e;
        }
    },

    getContactRequests: async (contactId, startDate, endDate, authenticatedId) => {
        if (contactId != authenticatedId) {
            const error = new Error('Access denied: Contact does not match token');
            error.status = 403;
            throw error;
        }
        const requests = await requestDal.getContactRequests(contactId, startDate, endDate);
        return requests;
    },
    
    find: async (volunteerId, hospitalId, departmentId, patientName, asOfDate) => {
        // Check date?

    }
};

export default requestService;