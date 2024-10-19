const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        password: await bcrypt.hash(faker.internet.password(), 10),
        exp: faker.number.int({ min: 0, max: 1000 }),
        streakDays: faker.number.int({ min: 0, max: 30 }),
      },
    });
    users.push(user);
  }

  // Create courses
  const courseCategories = ['Programming', 'Web Development', 'Data Science', 'Mobile Development', 'DevOps'];
  const courseLevels = ['Beginner', 'Intermediate', 'Advanced'];

  for (let i = 0; i < 5; i++) {
    const author = faker.helpers.arrayElement(users);
    const course = await prisma.course.create({
      data: {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        category: faker.helpers.arrayElement(courseCategories),
        level: faker.helpers.arrayElement(courseLevels),
        duration: `${faker.number.int({ min: 1, max: 12 })} weeks`,
        author: { connect: { id: author.id } },
        topics: {
          create: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, (_, index) => ({
            title: faker.lorem.words(3),
            content: faker.lorem.paragraphs(3),
            order: index + 1,
            status: faker.helpers.arrayElement(['PENDING', 'COMPLETED']),
            quiz: {
              create: {
                title: faker.lorem.words(2) + ' Quiz',
                questions: JSON.stringify(
                  Array.from({ length: 5 }, () => ({
                    question: faker.lorem.sentence() + '?',
                    options: Array.from({ length: 4 }, () => faker.lorem.word()),
                    correctAnswer: faker.number.int({ min: 0, max: 3 }),
                  }))
                ),
              },
            },
          })),
        },
        participants: {
          connect: faker.helpers.arrayElements(
            users.filter(u => u.id !== author.id),
            { min: 0, max: 5 }
          ).map(u => ({ id: u.id })),
        },
      },
    });

    console.log(`Created course: ${course.title}`);
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
