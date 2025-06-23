import { Patients, Thanks,ContactPeople } from '../../DB/index.mjs';

const contactsDal = {
    getThanks: async (userId) => {
        return await Thanks.findAll({
            where: {
                contactPeopleId: userId,
                is_deleted: false
            }
        });
    },

    createThanks: async (userId, data) => {
        return await Thanks.create({
            ...data,
            contactPeopleId: userId,
            is_deleted: false
        });
    }
};

export default contactsDal;