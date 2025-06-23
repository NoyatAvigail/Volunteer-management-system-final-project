import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const Thanks = sequelize.define('Thanks', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    contactId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'ContactPeople', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE', },
    fromName: { type: DataTypes.STRING, allowNull: false, },
    message: { type: DataTypes.TEXT, allowNull: false, },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false, },
    deleted_at: { type: DataTypes.DATE, allowNull: true, },
});

export default Thanks;
