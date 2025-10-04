/*
  Warnings:

  - The values [POLPANCA] on the enum `TipoContas` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoContas_new" AS ENUM ('POUPANCA', 'CONTA_CORRENTE', 'CARTAO_CREDITO');
ALTER TABLE "bancos" ALTER COLUMN "tipo" TYPE "TipoContas_new" USING ("tipo"::text::"TipoContas_new");
ALTER TYPE "TipoContas" RENAME TO "TipoContas_old";
ALTER TYPE "TipoContas_new" RENAME TO "TipoContas";
DROP TYPE "TipoContas_old";
COMMIT;
