// seed.js
import { Users, Passwords, ContactPeople, Volunteers, Patients, Hospitalizeds, Events, Thanks, VolunteeringForSectors, VolunteeringForGenders, VolunteeringInDepartments, VolunteerTypes } from "./index.mjs";
import { faker } from "@faker-js/faker";

export async function seedDynamicData() {
  try {
    const userCount = 10;
    let userIdCounter = 1000;
    let patientIdCounter = 2000;

    const users = [];
    const passwords = [];
    const volunteers = [];
    const contactPeople = [];
    const patients = [];
    const hospitalizeds = [];
    const events = [];
    const thanks = [];
    const volunteeringForSectors = [];
    const volunteeringForGenders = [];
    const volunteeringInDepartments = [];
    const volunteerTypes = [];

    for (let i = 0; i < userCount; i++) {
      const userId = userIdCounter++;
      const type = i % 2 === 0 ? 1 : 2; // 1 = Volunteer, 2 = ContactPerson
      const email = faker.internet.email();
      const phone = faker.phone.number();

      users.push({ id: userId, email, phone, type });
      passwords.push({ id: userId, password: faker.internet.password() });

      if (type === 1) {
        const gender = faker.number.int({ min: 1, max: 3 });
        const sector = faker.number.int({ min: 1, max: 5 });

        volunteers.push({
          userId,
          fullName: faker.person.fullName(),
          dateOfBirth: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
          gender,
          sector,
          address: faker.location.streetAddress(),
          volunteerStartDate: faker.date.past({ years: 1 }),
          volunteerEndDate: null,
          isActive: true,
          flexible: faker.datatype.boolean(),
        });

        volunteeringForSectors.push({ id: userId, sectorId: sector });
        volunteeringForGenders.push({ id: userId, genderId: gender });
        volunteeringInDepartments.push({
          id: userId,
          hospital: faker.number.int({ min: 1, max: 5 }),
          department: faker.number.int({ min: 1, max: 5 })
        });
        volunteerTypes.push({
          id: userId,
          volunteerTypeId: faker.number.int({ min: 1, max: 3 })
        });
      } else {
        contactPeople.push({
          userId,
          fullName: faker.person.fullName(),
          address: faker.location.streetAddress(),
        });
      }
    }

    for (let i = 0; i < 5; i++) {
      const patientUserId = patientIdCounter++;
      const contact = contactPeople[i % contactPeople.length];
      const gender = faker.helpers.arrayElement(["male", "female"]);

      patients.push({
        userId: patientUserId,
        contactPeopleId: contact.userId,
        fullName: faker.person.fullName(),
        dateOfBirth: faker.date.birthdate({ min: 0, max: 90, mode: "age" }),
        sector: faker.helpers.arrayElement(["Haredi", "General", "Religious"]),
        gender,
        address: faker.location.streetAddress(),
        dateOfDeath: null,
      });

      const hospitalized = {
        patientId: patientUserId,
        hospital: faker.number.int({ min: 1, max: 5 }),
        department: faker.number.int({ min: 1, max: 5 }),
        roomNumber: faker.number.int({ min: 100, max: 500 }).toString(),
        hospitalizationStart: faker.date.recent({ days: 20 }),
        hospitalizationEnd: faker.date.soon({ days: 10 }),
      };
      hospitalizeds.push(hospitalized);

      const event = {
        contactId: contact.userId,
        volunteerId: volunteers[i % volunteers.length].userId,
        hospitalizedsId: hospitalized.patientId,
        date: faker.date.soon({ days: 30 }),
        startTime: "10:00",
        endTime: "11:00",
      };
      events.push(event);

      thanks.push({
        contactId: contact.userId,
        fromName: faker.person.firstName(),
        message: faker.lorem.sentence(),
      });
    }

    await Users.bulkCreate(users);
    await Passwords.bulkCreate(passwords);
    await ContactPeople.bulkCreate(contactPeople);
    await Volunteers.bulkCreate(volunteers);
    await VolunteeringForSectors.bulkCreate(volunteeringForSectors);
    await VolunteeringForGenders.bulkCreate(volunteeringForGenders);
    await VolunteeringInDepartments.bulkCreate(volunteeringInDepartments);
    await VolunteerTypes.bulkCreate(volunteerTypes);
    await Patients.bulkCreate(patients);
    await Hospitalizeds.bulkCreate(hospitalizeds);
    await Events.bulkCreate(events);
    await Thanks.bulkCreate(thanks);

    console.log("✅ Dynamic data seeded successfully");
  } catch (error) {
    console.error("❌ Failed to seed dynamic data:", error);
  }
}
