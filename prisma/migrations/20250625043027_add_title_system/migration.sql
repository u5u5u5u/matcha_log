-- CreateEnum
CREATE TYPE "TitleType" AS ENUM ('POST_COUNT', 'TASTE_BITTER', 'TASTE_RICH', 'TASTE_SWEET', 'TASTE_BALANCE');

-- CreateEnum
CREATE TYPE "TitleRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeTitleId" TEXT;

-- CreateTable
CREATE TABLE "Title" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "TitleType" NOT NULL,
    "condition" JSONB NOT NULL,
    "rarity" "TitleRarity" NOT NULL DEFAULT 'COMMON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTitle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTitle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Title_name_key" ON "Title"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserTitle_userId_titleId_key" ON "UserTitle"("userId", "titleId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeTitleId_fkey" FOREIGN KEY ("activeTitleId") REFERENCES "Title"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTitle" ADD CONSTRAINT "UserTitle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTitle" ADD CONSTRAINT "UserTitle_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;
