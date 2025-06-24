import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import sequelize from '../DB/connectionDB.mjs';
import { seedStaticTables } from '../DB/seedStaticTables.mjs';
import {
    Users,
    Passwords,
    Volunteers,
    ContactPeople,
    Patients,
    Hospitalizeds,
    Events,
    Thanks,
    RelationToPatients,
    VolunteeringTypes,
    VolunteerTypes,
    VolunteeringInDepartments,
    VolunteeringForSectors,
    VolunteeringForGenders,
    UserTypes,
} from '../DB/index.mjs';

async function fakerSeed() {
    try {
        await sequelize.sync({ force: true });
        await seedStaticTables();

        function generateIsraeliId() {
            let id = faker.string.numeric({ length: 8 });
            let sum = 0;
            for (let i = 0; i < 8; i++) {
                let num = +id[i] * ((i % 2) + 1);
                if (num > 9) num -= 9;
                sum += num;
            }
            const checkDigit = (10 - (sum % 10)) % 10;
            const fullId = id + checkDigit;
            return parseInt(fullId, 10);
        }

        async function seedVolunteerDepartments(volunteerId) {
            const allHospitals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            const allDepartments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            const selectedHospitals = faker.helpers.arrayElements(allHospitals, 5);
            for (const hospitalId of selectedHospitals) {
                const selectedDepartments = faker.helpers.arrayElements(allDepartments, 8);
                for (const departmentId of selectedDepartments) {
                    await VolunteeringInDepartments.create({
                        id: volunteerId,
                        hospital: hospitalId,
                        department: departmentId,
                    });
                }
            }
        }

        async function seedVolunteerGenders(volunteerId) {
            const allGenders = [1, 2, 3];
            const selected = faker.helpers.arrayElements(allGenders, faker.number.int({ min: 2, max: 3 }));
            for (const genderId of selected) {
                await VolunteeringForGenders.create({
                    id: volunteerId,
                    genderId,
                });
            }
        }

        async function seedVolunteerSectors(volunteerId) {
            const allSectors = [1, 2, 3, 4, 5];
            const selected = faker.helpers.arrayElements(allSectors, faker.number.int({ min: 2, max: 4 }));
            for (const sectorId of selected) {
                await VolunteeringForSectors.create({
                    id: volunteerId,
                    sectorId,
                });
            }
        }

        async function seedEventsForContact(contactUserId, allVolunteers, allHospitalizeds) {
            const numEvents = faker.number.int({ min: 7, max: 20 });
            for (let i = 0; i < numEvents; i++) {
                const assignVolunteer = Math.random() < 0.5;
                const volunteer = assignVolunteer ? faker.helpers.arrayElement(allVolunteers) : null;
                const hospitalized = faker.helpers.arrayElement(allHospitalizeds);
                const date = faker.date.between({
                    from: faker.date.past({ years: 1 }),
                    to: faker.date.future({ years: 1 }),
                });
                const startHour = faker.number.int({ min: 8, max: 18 });
                const startTime = `${startHour.toString().padStart(2, '0')}:00:00`;
                const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00:00`;
                await Events.create({
                    contactId: contactUserId,
                    volunteerId: volunteer?.userId ?? null,
                    hospitalizedsId: hospitalized.id,
                    date,
                    startTime,
                    endTime,
                });
            }
        }

        const volunteerType = await UserTypes.findOne({ where: { description: 'Volunteer' } });
        const contactType = await UserTypes.findOne({ where: { description: 'ContactPerson' } });

        for (let i = 0; i < 15; i++) {
            try {
                const email = faker.internet.email();
                const phone = faker.phone.number();
                const password = faker.internet.password();
                const user = await Users.create({
                    id: generateIsraeliId(),
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
                await seedVolunteerDepartments(volunteer.id);
                await seedVolunteerGenders(volunteer.id);
                await seedVolunteerSectors(volunteer.id);

                console.log(`✔ Volunteer created: ${email} | password: ${password}`);
            } catch (err) {
                console.error(`❌ Failed to create volunteer at index ${i}:`, err.message);
            }
        }

        for (let i = 0; i < 15; i++) {
            const email = faker.internet.email();
            const phone = faker.phone.number();
            const password = faker.internet.password();

            const user = await Users.create({
                id: generateIsraeliId(),
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

            for (let j = 0; j < 3; j++) {
                const patientUser = await Users.create({
                    id: generateIsraeliId(),
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                    type: contactType.id,
                });

                const patient = await Patients.create({
                    userId: patientUser.id,
                    contactPeopleId: contact.userId,
                    fullName: faker.person.fullName(),
                    dateOfBirth: faker.date.past({ years: 40 }),
                    sector: faker.helpers.arrayElement([1, 2, 3, 4]),
                    gender: faker.helpers.arrayElement([1, 2]),
                    address: faker.location.streetAddress(),
                });

                await RelationToPatients.create({
                    contactPeopleId: contact.id,
                    patientId: patient.id,
                    relationId: 1,
                });

                for (let k = 0; k < 6; k++) {
                    await Hospitalizeds.create({
                        patientId: patient.userId,
                        hospital: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
                        department: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
                        roomNumber: faker.string.numeric(3),
                        hospitalizationStart: faker.date.past(),
                    });
                }
            }

            await Thanks.create({
                contactId: contact.id,
                fromName: faker.person.fullName(),
                message: faker.lorem.sentences(2),
            });

            const allVolunteers = await Volunteers.findAll({ attributes: ['userId'] });
            const hospitalizedsOfContact = await Hospitalizeds.findAll({
                include: {
                    model: Patients,
                    where: { contactPeopleId: contact.userId },
                    attributes: [],
                },
                attributes: ['id'],
            });

            await seedEventsForContact(contact.userId, allVolunteers, hospitalizedsOfContact);

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