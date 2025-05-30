/*
  Warnings:

  - Changed the type of `unit` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `unit` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "unit",
ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "unit",
ADD COLUMN     "unit" TEXT NOT NULL;

-- DropEnum
DROP TYPE "UnitType";
