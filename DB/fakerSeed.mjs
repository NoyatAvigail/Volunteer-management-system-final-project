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