-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'CARTAOCREDITO';

-- AlterTable
ALTER TABLE "bancos" ADD COLUMN     "diaFechamento" TEXT,
ADD COLUMN     "diaVencimento" TEXT,
ADD COLUMN     "limite" DECIMAL(10,2);
