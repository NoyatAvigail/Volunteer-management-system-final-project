// import { faker } from '@faker-js/faker';
// import {
//   Users,
//   Volunteers,
//   ContactPeople,
//   Patients,
//   Events,
//   Thanks,
//   VolunteeringInDepartments,
//   VolunteeringForGenders,
//   VolunteeringForSectors,
//   Hospitalizeds,
//   Departments,
//   Genders,
//   Sectors,
// } from '../DB/index.mjs';

// export async function seedAll() {
//   try {
//     // קודם למלא את הטבלאות הסטטיות אם צריך
//     // await seedStaticTables();

//     // ננקה טבלאות (רק אם זה בסדר בפרויקט שלך)
//     await Promise.all([
//       Patients.destroy({ where: {} }),
//       Events.destroy({ where: {} }),
//       Thanks.destroy({ where: {} }),
//       VolunteeringInDepartments.destroy({ where: {} }),
//       VolunteeringForGenders.destroy({ where: {} }),
//       VolunteeringForSectors.destroy({ where: {} }),
//       Hospitalizeds.destroy({ where: {} }),
//       Volunteers.destroy({ where: {} }),
//       ContactPeople.destroy({ where: {} }),
//       Users.destroy({ where: {} }),
//     ]);

//     // ניצור 20 משתמשים - מתנדבים ואנשי קשר
//     const volunteers = [];
//     const contactPeople = [];

//     for (let i = 0; i < 20; i++) {
//       // משתמש מתנדב
//       const userVolunteer = await Users.create({
//         email: faker.internet.email(),
//         phone: faker.phone.number(),
//         type: 'Volunteer',
//         is_deleted: false,
//       });
//       const volunteer = await Volunteers.create({
//         userId: userVolunteer.id,
//         fullName: faker.person.fullName(),
//         dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
//         gender: faker.helpers.arrayElement(['male', 'female', 'other']),
//         sector: faker.helpers.arrayElement(['Haredi', 'Religious', 'General', 'Traditional', 'Other']),
//         address: faker.location.streetAddress(),
//         isActive: true,
//         flexible: faker.datatype.boolean(),
//         is_deleted: false,
//       });
//       volunteers.push(volunteer);

//       const userContact = await Users.create({
//         email: faker.internet.email(),
//         phone: faker.phone.number(),
//         type: 'ContactPerson',
//         is_deleted: false,
//       });
//       const contact = await ContactPeople.create({
//         userId: userContact.id,
//         fullName: faker.person.fullName(),
//         address: faker.location.streetAddress(),
//         is_deleted: false,
//       });
//       contactPeople.push(contact);
//     }

//     for (const volunteer of volunteers) {
//     //   // כל מתנדב יקבל 1-3 פציינטים
//     //   const patientCount = faker.datatype.number({ min: 1, max: 3 });
//     //   for (let i = 0; i < patientCount; i++) {
//     //     await Patients.create({
//     //       volunteerId: volunteer.id,
//     //       fullName: faker.person.fullName(),
//     //       dateOfBirth: faker.date.birthdate({ min: 0, max: 90, mode: 'age' }),
//     //       gender: faker.helpers.arrayElement(['male', 'female', 'other']),
//     //       is_deleted: false,
//     //     });
//     //   }

//     //   // 0-2 אירועים לכל מתנדב
//     //   const eventCount = faker.datatype.number({ min: 0, max: 2 });
//     //   for (let i = 0; i < eventCount; i++) {
//     //     await Events.create({
//     //       volunteerId: volunteer.id,
//     //       description: faker.lorem.sentence(),
//     //       date: faker.date.recent(),
//     //       is_deleted: false,
//     //     });
//     //   }

//     //   // מתנדבים גם יכולים להיות במחלקות
//     //   const deptCount = faker.datatype.number({ min: 1, max: 3 });
//     //   const allDepartments = await Departments.findAll();
//     //   for (let i = 0; i < deptCount; i++) {
//     //     const dept = faker.helpers.arrayElement(allDepartments);
//     //     await VolunteeringInDepartments.create({
//     //       volunteerId: volunteer.id,
//     //       departmentId: dept.id,
//     //     });
//     //   }

//       // מתנדבים יכולים להיות מותאמים לפי מגדר ומגזר
//       const gender = faker.helpers.arrayElement(await Genders.findAll());
//       await VolunteeringForGenders.create({
//         volunteerId: volunteer.id,
//         genderId: gender.id,
//       });
//       const sector = faker.helpers.arrayElement(await Sectors.findAll());
//       await VolunteeringForSectors.create({
//         volunteerId: volunteer.id,
//         sectorId: sector.id,
//       });
//     }

//     // מוסיפים פציינטים ואירועים גם לאנשי קשר
//     for (const contact of contactPeople) {
//       const patientCount = faker.datatype.number({ min: 1, max: 3 });
//       for (let i = 0; i < patientCount; i++) {
//         await Patients.create({
//           contactPersonId: contact.id,
//           fullName: faker.person.fullName(),
//           dateOfBirth: faker.date.birthdate({ min: 0, max: 90, mode: 'age' }),
//           gender: faker.helpers.arrayElement(['male', 'female', 'other']),
//           is_deleted: false,
//         });
//       }

//       const eventCount = faker.datatype.number({ min: 0, max: 2 });
//       for (let i = 0; i < eventCount; i++) {
//         await Events.create({
//           contactPersonId: contact.id,
//           description: faker.lorem.sentence(),
//           date: faker.date.recent(),
//           is_deleted: false,
//         });
//       }
//     }

//     console.log('Seeding complete!');
//   } catch (error) {
//     console.error('Seed failed:', error);
//   }
// }
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import sequelize from './connectionDB.mjs';

import {
    Users,
    Passwords,
    Volunteers,
    ContactPeople,
    Patients,
    Hospitalizeds,
    Thanks,
    RelationToPatients,
    VolunteeringTypes,
    VolunteerTypes,
    VolunteeringInDepartments,
    VolunteeringForSectors,
    VolunteeringForGenders,
    UserTypes,
} from './index.mjs';

async function fakerSeed() {
    try {
        await sequelize.sync({ force: true });

        const volunteerType = await UserTypes.findOne({ where: { description: 'Volunteer' } });
        const contactType = await UserTypes.findOne({ where: { description: 'ContactPerson' } });

        for (let i = 0; i < 10; i++) {
            const email = faker.internet.email();
            const phone = faker.phone.number();
            const password = faker.internet.password();
            const user = await Users.create({
                email,
                phone,
                type: volunteerType.id,
            });

            await Passwords.create({
                id: user.id,
                password: await bcrypt.hash(password, 10),
            });

            const volunteer = await Volunteers.create({
                userId: user.id,
                fullName: faker.person.fullName(),
                dateOfBirth: faker.date.past({ years: 30 }),
                gender: faker.helpers.arrayElement([1, 2]),
                sector: faker.helpers.arrayElement([1, 2, 3, 4]),
                address: faker.location.streetAddress(),
                volunteerStartDate: faker.date.past({ years: 1 }),
                isActive: true,
                flexible: faker.datatype.boolean(),
            });

            const volunteeringType = await VolunteeringTypes.findOne();
            await VolunteerTypes.create({
                id: volunteer.id,
                volunteerTypeId: volunteeringType.id,
            });

            await VolunteeringInDepartments.create({
                id: volunteer.id,
                hospital: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
                department: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
            });

            await VolunteeringForSectors.create({
                id: volunteer.id,
                sectorId: faker.helpers.arrayElement([1, 2, 3, 4]),
            });

            await VolunteeringForGenders.create({
                id: volunteer.id,
                genderId: faker.helpers.arrayElement([1, 2]),
            });
            console.log(`✔ Volunteer created: ${email} | password: ${password}`);
        }

        for (let i = 0; i < 10; i++) {
            const email = faker.internet.email();
            const phone = faker.phone.number();
            const password = faker.internet.password();

            const user = await Users.create({
                email,
                phone,
                type: contactType.id,
            });

            await Passwords.create({
                id: user.id,
                password: await bcrypt.hash(password, 10),
            });

            const contact = await ContactPeople.create({
                userId: user.id,
                fullName: faker.person.fullName(),
                address: faker.location.streetAddress(),
            });

            const patientUser = await Users.create({
                email: faker.internet.email(),
                phone: faker.phone.number(),
                type: contactType.id,
            });

            const patient = await Patients.create({
                userId: patientUser.id,
                contactPeopleId: contact.userId,
                fullName: faker.person.fullName(),
                dateOfBirth: faker.date.past({ years: 40 }),
                sector: 'General',
                gender: 'female',
                address: faker.location.streetAddress(),
            });

            await RelationToPatients.create({
                contactPeopleId: contact.id,
                patientId: patient.id,
                relationId: 1,
            });

            await Hospitalizeds.create({
                patientId: patient.userId,
                hospital: faker.helpers.arrayElement([1, 2, 3]),
                department: faker.helpers.arrayElement([1, 2, 3]),
                roomNumber: faker.string.numeric(3),
                hospitalizationStart: faker.date.past(),
            });

            await Thanks.create({
                contactId: contact.id,
                fromName: faker.person.fullName(),
                message: faker.lorem.sentences(2),
            });

            console.log(`✔ Contact person created: ${email} | password: ${password}`);
        }

        console.log('\n🎉 Fake data seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

fakerSeed();