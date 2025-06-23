import { Hospitalizeds, Hospitals,Departments } from '../../DB/index.mjs';

const hospitalizedsDal = {
    // getHospitalizeds: async (patientId) => {
    //     return await Hospitalizeds.findAll({
    //         where: { patientId: patientId, is_deleted: 0 },
    //         include: [{
    //             model: Hospitals,
    //             attributes: ['id', 'description']
    //         },]
    //     });
    // },
    getHospitalizeds: async (patientId) => {
        return await Hospitalizeds.findAll({
            where: {
                patientId: patientId,
                is_deleted: false
            },
            include: [
                {
                    model: Hospitals,
                    attributes: ['id', 'description']
                },
                {
                    model: Departments,
                    attributes: ['id', 'description']
                }
            ]
        });
    },
    createHospitalized: async (patientId, body) => {
        return await Hospitalizeds.create({
            ...body,
            patientId
        });
    },
};

export default hospitalizedsDal;