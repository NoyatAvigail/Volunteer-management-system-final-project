import { Volunteers } from '../models/Volunteers.js';
import { Events } from '../models/Events.js';
import { VolunteeringInDepartments } from '../models/VolunteeringInDepartments.js';
import { Thanks } from '../models/Thanks.js';
import { Sequelize } from 'sequelize';

const homeDal = {
    async countActiveVolunteers() {
        return await Volunteers.count({
            where: {
                is_deleted: false,
                isActive: true,
            },
        });
    },

    async sumVolunteerHours() {
        const events = await Events.findAll({
            where: {
                volunteerId: { [Sequelize.Op.ne]: null },
                is_deleted: false
            },
            attributes: ['startTime', 'endTime']
        });
        let totalMinutes = 0;
        for (const event of events) {
            const start = new Date(`1970-01-01T${event.startTime}Z`);
            const end = new Date(`1970-01-01T${event.endTime}Z`);
            const diffMs = end - start;
            totalMinutes += diffMs / (1000 * 60);
        }
        const totalHours = totalMinutes / 60;
        return Math.round(totalHours * 10) / 10;
    },

    async countActiveHospitals() {
        const hospitals = await VolunteeringInDepartments.findAll({
            where: { is_deleted: false },
            attributes: ['hospital'],
            group: ['hospital'],
            raw: true,
        });
        return hospitals.length;
    },

    async countActiveDepartments() {
        const departments = await VolunteeringInDepartments.findAll({
            where: { is_deleted: false },
            attributes: ['department'],
            group: ['department'],
            raw: true,
        });
        return departments.length;
    },

    async getAllThanksNotes() {
        return await Thanks.findAll({
            where: { is_deleted: false },
            order: [['createdAt', 'DESC']],
            raw: true
        });
    }
};

export default homeDal;