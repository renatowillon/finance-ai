-- AlterTable
ALTER TABLE "transacao_cartaocredito" ADD COLUMN     "faturaId" TEXT;

-- CreateTable
CREATE TABLE "fatura_cartao" (
    "id" TEXT NOT NULL,
    "cartaoCreditoId" TEXT NOT NULL,
    "competencia" TIMESTAMP(3) NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "fechada" BOOLEAN NOT NULL,
    "paga" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fatura_cartao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transacao_cartaocredito" ADD CONSTRAINT "transacao_cartaocredito_faturaId_fkey" FOREIGN KEY ("faturaId") REFERENCES "fatura_cartao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fatura_cartao" ADD CONSTRAINT "fatura_cartao_cartaoCreditoId_fkey" FOREIGN KEY ("cartaoCreditoId") REFERENCES "cartao_credito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
