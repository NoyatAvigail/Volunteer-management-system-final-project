import { faker } from '@faker-js/faker';
import {
  Users,
  Volunteers,
  ContactPeople,
  Patients,
  Events,
  Thanks,
  VolunteeringInDepartments,
  VolunteeringForGenders,
  VolunteeringForSectors,
  Hospitalizeds,
  Departments,
  Genders,
  Sectors,
} from '../DB/index.mjs';

export async function seedAll() {
  try {
    // קודם למלא את הטבלאות הסטטיות אם צריך
    // await seedStaticTables();

    // ננקה טבלאות (רק אם זה בסדר בפרויקט שלך)
    await Promise.all([
      Patients.destroy({ where: {} }),
      Events.destroy({ where: {} }),
      Thanks.destroy({ where: {} }),
      VolunteeringInDepartments.destroy({ where: {} }),
      VolunteeringForGenders.destroy({ where: {} }),
      VolunteeringForSectors.destroy({ where: {} }),
      Hospitalizeds.destroy({ where: {} }),
      Volunteers.destroy({ where: {} }),
      ContactPeople.destroy({ where: {} }),
      Users.destroy({ where: {} }),
    ]);

    // ניצור 20 משתמשים - מתנדבים ואנשי קשר
    const volunteers = [];
    const contactPeople = [];

    for (let i = 0; i < 20; i++) {
      // משתמש מתנדב
      const userVolunteer = await Users.create({
        email: faker.internet.email(),
        phone: faker.phone.number(),
        type: 'Volunteer',
        is_deleted: false,
      });
      const volunteer = await Volunteers.create({
        userId: userVolunteer.id,
        fullName: faker.person.fullName(),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
        sector: faker.helpers.arrayElement(['Haredi', 'Religious', 'General', 'Traditional', 'Other']),
        address: faker.location.streetAddress(),
        isActive: true,
        flexible: faker.datatype.boolean(),
        is_deleted: false,
      });
      volunteers.push(volunteer);

      const userContact = await Users.create({
        email: faker.internet.email(),
        phone: faker.phone.number(),
        type: 'ContactPerson',
        is_deleted: false,
      });
      const contact = await ContactPeople.create({
        userId: userContact.id,
        fullName: faker.person.fullName(),
        address: faker.location.streetAddress(),
        is_deleted: false,
      });
      contactPeople.push(contact);
    }

    for (const volunteer of volunteers) {
    //   // כל מתנדב יקבל 1-3 פציינטים
    //   const patientCount = faker.datatype.number({ min: 1, max: 3 });
    //   for (let i = 0; i < patientCount; i++) {
    //     await Patients.create({
    //       volunteerId: volunteer.id,
    //       fullName: faker.person.fullName(),
    //       dateOfBirth: faker.date.birthdate({ min: 0, max: 90, mode: 'age' }),
    //       gender: faker.helpers.arrayElement(['male', 'female', 'other']),
    //       is_deleted: false,
    //     });
    //   }

    //   // 0-2 אירועים לכל מתנדב
    //   const eventCount = faker.datatype.number({ min: 0, max: 2 });
    //   for (let i = 0; i < eventCount; i++) {
    //     await Events.create({
    //       volunteerId: volunteer.id,
    //       description: faker.lorem.sentence(),
    //       date: faker.date.recent(),
    //       is_deleted: false,
    //     });
    //   }

    //   // מתנדבים גם יכולים להיות במחלקות
    //   const deptCount = faker.datatype.number({ min: 1, max: 3 });
    //   const allDepartments = await Departments.findAll();
    //   for (let i = 0; i < deptCount; i++) {
    //     const dept = faker.helpers.arrayElement(allDepartments);
    //     await VolunteeringInDepartments.create({
    //       volunteerId: volunteer.id,
    //       departmentId: dept.id,
    //     });
    //   }

      // מתנדבים יכולים להיות מותאמים לפי מגדר ומגזר
      const gender = faker.helpers.arrayElement(await Genders.findAll());
      await VolunteeringForGenders.create({
        volunteerId: volunteer.id,
        genderId: gender.id,
      });
      const sector = faker.helpers.arrayElement(await Sectors.findAll());
      await VolunteeringForSectors.create({
        volunteerId: volunteer.id,
        sectorId: sector.id,
      });
    }

    // מוסיפים פציינטים ואירועים גם לאנשי קשר
    for (const contact of contactPeople) {
      const patientCount = faker.datatype.number({ min: 1, max: 3 });
      for (let i = 0; i < patientCount; i++) {
        await Patients.create({
          contactPersonId: contact.id,
          fullName: faker.person.fullName(),
          dateOfBirth: faker.date.birthdate({ min: 0, max: 90, mode: 'age' }),
          gender: faker.helpers.arrayElement(['male', 'female', 'other']),
          is_deleted: false,
        });
      }

      const eventCount = faker.datatype.number({ min: 0, max: 2 });
      for (let i = 0; i < eventCount; i++) {
        await Events.create({
          contactPersonId: contact.id,
          description: faker.lorem.sentence(),
          date: faker.date.recent(),
          is_deleted: false,
        });
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seed failed:', error);
  }
}
