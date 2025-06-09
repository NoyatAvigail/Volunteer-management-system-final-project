import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const FixedVolunteerAvailability = sequelize.define('FixedVolunteerAvailability', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    volunteerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "volunteers", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    dayOfWeek: { type: DataTypes.ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
});

export default FixedVolunteerAvailability;