import { DataTypes } from 'sequelize';
import sequelize from '../../DB/db.mjs';

export const OneTimeVolunteerAvailability = sequelize.define('OneTimeVolunteerAvailability', {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: { model: "volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    availableDate: { type: DataTypes.DATEONLY, allowNull: false, },
    startTime: { type: DataTypes.TIME, allowNull: true },
    endTime: { type: DataTypes.TIME, allowNull: true },
});

export default OneTimeVolunteerAvailability;