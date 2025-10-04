-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "bancoId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
