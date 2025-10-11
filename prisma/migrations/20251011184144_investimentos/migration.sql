-- CreateEnum
CREATE TYPE "StatusInvestimento" AS ENUM ('ATIVO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoTransacaoInvestimento" AS ENUM ('DEPOSITO', 'RETIRADA');

-- CreateTable
CREATE TABLE "investimentos" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "meta" DECIMAL(10,2) NOT NULL,
    "valorAtual" DECIMAL(10,2) NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataConclusao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Status" "StatusInvestimento" NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "investimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacoes_investimentos" (
    "id" SERIAL NOT NULL,
    "investimentoId" INTEGER NOT NULL,
    "tipo" "TipoTransacaoInvestimento" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" TEXT,

    CONSTRAINT "transacoes_investimentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "investimentos" ADD CONSTRAINT "investimentos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes_investimentos" ADD CONSTRAINT "transacoes_investimentos_investimentoId_fkey" FOREIGN KEY ("investimentoId") REFERENCES "investimentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
