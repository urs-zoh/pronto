/*
  Warnings:

  - Changed the type of `amount_per_unit` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "amount_per_unit",
ADD COLUMN     "amount_per_unit" DOUBLE PRECISION NOT NULL;
