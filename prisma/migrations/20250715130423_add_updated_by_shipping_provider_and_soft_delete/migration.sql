/*
  Warnings:

  - You are about to drop the column `provider` on the `Shipping` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedBy" INTEGER;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Shipping" DROP COLUMN "provider",
ADD COLUMN     "providerId" INTEGER;

-- CreateTable
CREATE TABLE "ShippingProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ShippingProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingProvider_name_key" ON "ShippingProvider"("name");

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ShippingProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
