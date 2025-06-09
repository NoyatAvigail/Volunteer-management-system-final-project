import { Sectors } from '../Server/models/Sectors.js';
import { Genders } from '../Server/models/Genders.js';
import { Hospitals } from '../Server/models/Hospitals.js';
import { Departments } from '../Server/models/Departments.js';
import { VolunteeringTypes } from '../Server/models/VolunteeringTypes.js';
import { FamilyRelations } from '../Server/models/FamilyRelations.js';
import { UserTypes } from '../Server/models/UserTypes.js';

export async function seedStaticTables() {
    try {
        const userTypes = ['Volunteer', 'ContactPerson'];
        for (const type of userTypes) {
            await UserTypes.findOrCreate({ where: { description: type } });
        }
        const familyRelations = [
            'אמא', 'אבא', 'אח', 'אחות', 'סבא', 'סבתא',
            'דוד', 'דודה', 'בן דוד', 'בת דוד', 'בן זוג',
            'בת זוג', 'ילד', 'ילדה'
        ];
        for (const relation of familyRelations) {
            await FamilyRelations.findOrCreate({ where: { description: relation } });
        }
        const volunteeringTypes = [
            'שומר/ת', 'מחלק/ת אוכלת', 'ליצן רפואי',
        ];
        for (const type of volunteeringTypes) {
            await VolunteeringTypes.findOrCreate({ where: { description: type } });
        }
        const sectors = ['חרדי/ת', 'דתי/ת', 'חילוני/ת', 'מסורתי/ת', 'אחר'];
        for (const sector of sectors) {
            await Sectors.findOrCreate({ where: { description: sector } });
        }
        const genders = ['זכר', 'נקבה', 'אחר'];
        for (const gender of genders) {
            await Genders.findOrCreate({ where: { description: gender } });
        }
        const hospitals = [
            'שיבא- תל השומר', 'איכילוב', 'וולפסון', 'הלל יפה', 'רמב"ם',
            'זיו', 'פוריה', 'ברזילי', 'אסף הרופא', 'סורוקה',
            'בילינסון', 'שניידר-רפואת ילדים', 'הדסה עין כרם', 'הדסה הר הצופים',
            'שערי צדק', 'לניאדו', 'אסותא', 'מעייני הישועה'
        ];
        for (const hospital of hospitals) {
            await Hospitals.findOrCreate({ where: { description: hospital } });
        }
        const departments = [
            'חדר מיון', 'פנימית', 'כירורגיה', 'ילדים', 'אורתופדיה',
            'יולדות', 'טראומה', 'קרדיולוגיה', 'נורולוגיה', 'אונקולגיה',
            'המטולוגיה', 'עורומין', 'גריאטריה', 'טיפול נמרץ', 'פסיכיאטריה', 'שיקום'
        ];
        for (const dept of departments) {
            await Departments.findOrCreate({ where: { description: dept } });
        }
        console.log('Static tables seeded successfully');
    } catch (error) {
        console.error('Failed to seed static tables:', error);
    }
}