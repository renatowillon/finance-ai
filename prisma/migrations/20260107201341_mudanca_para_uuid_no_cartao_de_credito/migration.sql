/*
  Warnings:

  - The primary key for the `CartaoCredito` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CartaoCredito" DROP CONSTRAINT "CartaoCredito_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CartaoCredito_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CartaoCredito_id_seq";
