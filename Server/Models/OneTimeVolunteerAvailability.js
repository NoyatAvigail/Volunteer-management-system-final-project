import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const OneTimeVolunteerAvailability = sequelize.define('OneTimeVolunteerAvailability', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    volunteerId: { type: DataTypes.INTEGER, allowNull: false },
    availableDate: { type: DataTypes.DATEONLY, allowNull: false, },
    startTime: { type: DataTypes.TIME, allowNull: true },
    endTime: { type: DataTypes.TIME, allowNull: true },
});

export default OneTimeVolunteerAvailability;