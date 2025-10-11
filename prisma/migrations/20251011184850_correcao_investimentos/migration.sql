/*
  Warnings:

  - You are about to drop the column `dataConclusao` on the `investimentos` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `investimentos` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `transacoes_investimentos` table. All the data in the column will be lost.
  - Added the required column `cor` to the `investimentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "investimentos" DROP COLUMN "dataConclusao",
DROP COLUMN "dataInicio",
ADD COLUMN     "cor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transacoes_investimentos" DROP COLUMN "data";
