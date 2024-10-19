/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `subtopicId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Topic` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[topicId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questions` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_subtopicId_fkey";

-- DropIndex
DROP INDEX "Quiz_subtopicId_key";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "createdAt",
DROP COLUMN "subtopicId",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "questions" JSONB NOT NULL,
ADD COLUMN     "topicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subtopic" ADD COLUMN     "quizId" TEXT;

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "order" INTEGER NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_topicId_key" ON "Quiz"("topicId");

-- AddForeignKey
ALTER TABLE "Subtopic" ADD CONSTRAINT "Subtopic_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
