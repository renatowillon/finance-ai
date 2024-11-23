-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSITO', 'DESPESA', 'INVESTIMENTO');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('SALARIO', 'INVESTIMENTOS', 'FREELANCER', 'VENDAS', 'REEMBOLSOS', 'EMPRESTIMOS', 'ALUGUEIS', 'PREMIOS', 'DOACOES', 'OUTROS', 'ALIMENTACAO', 'TRANSPORTE', 'MORADIA', 'SAUDE', 'EDUCACAO', 'ENTRETENIMENTO', 'ROUPAS', 'VIAGENS', 'CONTAS', 'OUTRAS');

-- CreateEnum
CREATE TYPE "TransactionPaymentMethods" AS ENUM ('PIX', 'TRANSFERENCIA', 'BOLETO', 'DINHEIRO', 'CARTAO_DEBITO', 'CARTAO_CREDITO');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "category" "TransactionCategory" NOT NULL,
    "paymentMethod" "TransactionPaymentMethods" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
