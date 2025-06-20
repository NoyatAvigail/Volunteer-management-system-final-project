// create: async (data) => {
//     const transaction = await sequelize.transaction();
//     try {
//         // CheckPatient if not exists throw exception
//         let checkIfPatientsExists = await genericDAL.findById(Patients, data.patientId);
//         if (!checkIfPatientsExists)
//             throw new Error("patient not exists");
//         //CheckHospitilized if exists with other details - > question??
//         let checkIfHospitailizedExists = await genericDAL.findById(Hospitalizeds, data.hospitalizedsId);
//         //addrequesst

//         let newRequest = await genericDAL.createModel(Users, { email, type, phone, id }, { transaction });
//         const hashed = await hashPassword(password);
//         const pwd = await genericDAL.createModel(Passwords, {
//             id: newUser.id,
//             password: hashed
//         }, { transaction });

//         if (type == cUserType.CONTACTPERSON) {
//             const contact = await genericDAL.createModel(ContactPeople,
//                 {
//                     userId: newUser.id,
//                     fullName: rest.fullName,
//                     address: rest.address
//                 }, { transaction });
//             //TODO check if patient exists, if not then create
//             const patient = await genericDAL.createModel(Patients,
//                 {
//                     userId: rest.patientId,
//                     contactPeopleId: contact.id,
//                     fullName: rest.patientFullName,
//                     dateOfBirth: rest.patientDateOfBirth,
//                     sector: rest.patientSector,
//                     gender: rest.patientGender,
//                     address: rest.patientAddress,
//                     dateOfDeath: rest.patientDateOfDeath || null,
//                     interestedInReceivingNotifications: rest.patientInterestedInReceivingNotifications ?? true
//                 }, { transaction });

//             const relationToPatients = await genericDAL.createModel(RelationToPatients,
//                 {
//                     contactPeopleId: contact.id,
//                     patientId: patient.id,
//                     relationId: rest.relationId,
//                 }, { transaction });
//             //TODO check if hospitalized exists, if exists then popup check to user, else create 
//             const hospitalizeds = await genericDAL.createModel(Hospitalizeds,
//                 {
//                     patientId: patient.id,
//                     hospital: rest.hospital,
//                     department: rest.department,
//                     roomNumber: rest.roomNumber,
//                     hospitalizationStart: rest.hospitalizationStart,
//                     hospitalizationEnd: rest.hospitalizationEnd
//                 }, { transaction });

//             newUser = {
//                 ...rest,
//                 type: type,
//                 id: contact.id,
//                 autoId: contact.id
//             };
//         }

//         await transaction.commit();
//         return newUser;

//     } catch (e) {
//         await transaction.rollback();
//         console.error("Signup failed:", e);
//         throw e;
//     }
// },
import genericDAL from "../dal/genericDal.js"
import requestsDal from "../dal/requestsDal.js"

const requestService = {
    utils: async (authenticatedType) => {
        const type = genericDAL.getModelByName('UserTypes');
        const userType = await genericDAL.findById(type, authenticatedType);
        const userTypeDesc = userType?.description;
        const model = userTypeDesc === 'Volunteers'
            ? genericDAL.getModelByName('Volunteers')
            : genericDAL.getModelByName('ContactPeople');
        return { userTypeDesc, model };
    },
    
    getRequests: async (authenticatedId, authenticatedType,startDate, endDate) => {
        console.log("authenticatedId:", authenticatedId);

        const utils = await requestService.utils(authenticatedType);
        console.log("authenticatedType:", utils);

        const users = await genericDAL.findByField(utils.model, { id: authenticatedId });
        const user = users[0];
        if (!user) {
            const error = new Error(`${user} not found`);
            error.status = 404;
            throw error;
        }
        const userIdFromToken = user.userId;
        const requests = utils.userTypeDesc == 'Volunteers' ?
            await requestsDal.getVolunteerRequests(userIdFromToken) :
            await requestsDal.getContactRequests(userIdFromToken)
        return requests;
    },

    createRequests: async (body, authenticatedId, authenticatedType) => {
        const userUtils = utils(authenticatedType);
        const user = await genericDAL.findById(userUtils.model, authenticatedId);
        if (!user) {
            const error = new Error(`User not found`);
            error.status = 404;
            throw error;
        }

        const userIdFromToken = user.userId;

        if (userUtils.userTypeDesc !== 'ContactPeople') {
            const error = new Error('Only ContactPeople can create requests');
            error.status = 403;
            throw error;
        }

        const newEvent = await requestsDal.createEvent({ ...body, contactId: userIdFromToken });
        return newEvent;
    },

    deleteEvent: async (authenticatedType, eventId) => {
        const userUtils = utils(authenticatedType);
        if (userUtils.userTypeDesc == 'ContactPeople') {
            const result = await requestsDal.softDeleteEvent(eventId);
            return result;
        }

    },

    updatRequests: async (body, authenticatedId, authenticatedType, eventId) => {
        if (authenticatedType === 'Volunteers') {
            return await requestsDal.assignVolunteerToEvent(eventId, authenticatedId);
        } else if (authenticatedType === 'ContactPeople') {
            if ('volunteerId' in body) {
                delete body.volunteerId; 
            }
            return await requestsDal.updateEventDetails(eventId, body);
        } else {
            const error = new Error("User type not authorized to update events.");
            error.status = 403;
            throw error;
        }
    },
}

export default requestService;