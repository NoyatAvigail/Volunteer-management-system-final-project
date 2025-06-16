import { Sectors } from '../Server/Models/Sectors.js';
import { Genders } from '../Server/models/Genders.js';
import { Hospitals } from '../Server/Models/Hospitals.js';
import { Departments } from '../Server/Models/Departments.js';
import { VolunteeringTypes } from '../Server/Models/VolunteeringTypes.js';
import { FamilyRelations } from '../Server/Models/FamilyRelations.js';
import { UserTypes } from '../Server/Models/UserTypes.js';

export async function seedStaticTables() {
    try {
        const userTypes = ['Volunteer', 'ContactPerson'];
        for (const type of userTypes) {
            await UserTypes.findOrCreate({ where: { description: type } });
        }
        const familyRelations = [
            'mother', 'father', 'brother', 'sister', 'grandfather', 'grandmother',
            'uncle', 'aunt', 'cousin', 'cousin', 'spouse',
            'spouse', 'child', 'child'
        ];
        for (const relation of familyRelations) {
            await FamilyRelations.findOrCreate({ where: { description: relation } });
        }
        const volunteeringTypes = [
            'guard', 'food distributor', 'medical clown',
        ];
        for (const type of volunteeringTypes) {
            await VolunteeringTypes.findOrCreate({ where: { description: type } });
        }
        const sectors = ['Haredi', 'Religious', 'General', 'Traditional', 'Other'];
        for (const sector of sectors) {
            await Sectors.findOrCreate({ where: { description: sector } });
        }
        const genders = ['male', 'female', 'other'];
        for (const gender of genders) {
            await Genders.findOrCreate({ where: { description: gender } });
        }
        const hospitals = [
            'Sheba-Tel Hashomer', 'Ichilov', 'Wolfson', 'Hillel Yaffe', 'Rambam',
            'Ziv', 'Poriya', 'Barzilai', 'Asaf Harofeh', 'Soroka',
            'Beilinson', 'Schneider-Pediatrics', 'Hadassah Ein Kerem', 'Hadassah Mount Scopus',
            'Shaarei Tzedek', 'Laniado', 'Assuta', 'Maayanei Hayeshua'
        ];
        for (const hospital of hospitals) {
            await Hospitals.findOrCreate({ where: { description: hospital } });
        }
        const departments = [
            'ER', 'Internal', 'Surgery', 'Pediatrics', 'Orthopedics',
            'Maternity', 'Trauma', 'Cardiology', 'Neurology', 'Oncology',
            'Hematology', 'Urology', 'Geriatrics', 'ICU', 'Psychiatry', 'Rehabilitation'
        ];
        for (const dept of departments) {
            await Departments.findOrCreate({ where: { description: dept } });
        }
        console.log('Static tables seeded successfully');
    } catch (error) {
        console.error('Failed to seed static tables:', error);
    }
}