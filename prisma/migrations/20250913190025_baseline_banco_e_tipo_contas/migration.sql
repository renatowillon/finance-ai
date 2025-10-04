-- CreateEnum
CREATE TYPE "TipoContas" AS ENUM ('POLPANCA', 'CONTA_CORRENTE', 'CARTAO_CREDITO');

-- CreateTable
CREATE TABLE "bancos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoContas" NOT NULL,
    "saldoInicial" DECIMAL(10,2) NOT NULL,
    "saldoAtual" DECIMAL(10,2) NOT NULL,
    "cor" TEXT NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);
