import { DataTypes } from 'sequelize';
import sequelize from '../../DB/connectionDB.mjs';

export const EmailVerifications = sequelize.define('EmailVerifications', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
    token: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    used: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export default EmailVerifications;