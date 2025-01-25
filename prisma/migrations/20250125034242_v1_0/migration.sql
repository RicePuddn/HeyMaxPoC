/*
  Warnings:

  - You are about to drop the column `providerID` on the `FoodItem` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `FoodItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `FoodItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FoodItem" DROP CONSTRAINT "FoodItem_providerID_fkey";

-- AlterTable
ALTER TABLE "FoodItem" DROP COLUMN "providerID",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "providerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
