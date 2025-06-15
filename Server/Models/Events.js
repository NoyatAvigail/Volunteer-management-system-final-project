import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const Events = sequelize.define('Events', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    contactId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "ContactPeople", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    volunteerId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Volunteers", key: "userId" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    hospitalizedsId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Hospitalizeds", key: "id" }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    date: { type: DataTypes.DATE, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true }
});

export default Events;