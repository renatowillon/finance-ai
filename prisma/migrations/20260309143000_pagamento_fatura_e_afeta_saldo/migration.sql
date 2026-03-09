-- AlterTable
ALTER TABLE "transactions"
ADD COLUMN "afetaSaldo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "faturaCartaoId" TEXT;

-- AlterTable
ALTER TABLE "fatura_cartao"
ADD COLUMN "valorPago" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "transactions"
ADD CONSTRAINT "transactions_faturaCartaoId_fkey"
FOREIGN KEY ("faturaCartaoId") REFERENCES "fatura_cartao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
