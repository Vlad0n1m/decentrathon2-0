const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Удаление всех записей из Question (если есть)
    if (prisma.question) {
      await prisma.question.deleteMany();
      console.log('Все записи из Question удалены');
    }

    // Удаление всех записей из Quiz
    await prisma.quiz.deleteMany();
    console.log('Все записи из Quiz удалены');

    // Удаление всех записей из Subtopic
    await prisma.subtopic.deleteMany();
    console.log('Все записи из Subtopic удалены');

    // Удаление всех записей из Topic
    await prisma.topic.deleteMany();
    console.log('Все записи из Topic удалены');

    // Удаление всех записей из Course
    await prisma.course.deleteMany();
    console.log('Все записи из Course удалены');

    // Удаление всех записей из User
    await prisma.user.deleteMany();
    console.log('Все записи из User удалены');

    console.log('База данных очищена успешно');
  } catch (error) {
    console.error('Ошибка при очистке базы данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
