/*
  Warnings:

  - You are about to drop the `CartaoCredito` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartaoCredito" DROP CONSTRAINT "CartaoCredito_userId_fkey";

-- DropTable
DROP TABLE "CartaoCredito";

-- CreateTable
CREATE TABLE "cartao_credito" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "limite" DECIMAL(10,2) NOT NULL,
    "diaFechamento" INTEGER NOT NULL,
    "diaVencimento" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cartao_credito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacao_cartaocredito" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataCompra" TIMESTAMP(3) NOT NULL,
    "parcelada" BOOLEAN NOT NULL DEFAULT false,
    "parcelaAtual" INTEGER,
    "totalParcelas" INTEGER,
    "competencia" TIMESTAMP(3) NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "dataPagamento" TIMESTAMP(3),
    "cartaoCreditoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacao_cartaocredito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transacao_cartaocredito_cartaoCreditoId_competencia_idx" ON "transacao_cartaocredito"("cartaoCreditoId", "competencia");

-- AddForeignKey
ALTER TABLE "cartao_credito" ADD CONSTRAINT "cartao_credito_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao_cartaocredito" ADD CONSTRAINT "transacao_cartaocredito_cartaoCreditoId_fkey" FOREIGN KEY ("cartaoCreditoId") REFERENCES "cartao_credito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
