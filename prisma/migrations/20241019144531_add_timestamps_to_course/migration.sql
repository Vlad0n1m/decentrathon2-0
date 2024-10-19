/*
  Warnings:

  - You are about to drop the column `lastActiveDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `streakDays` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subtopic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Subtopic" DROP CONSTRAINT "Subtopic_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Subtopic" DROP CONSTRAINT "Subtopic_topicId_fkey";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "questions" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastActiveDate",
DROP COLUMN "streakDays";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Subtopic";
