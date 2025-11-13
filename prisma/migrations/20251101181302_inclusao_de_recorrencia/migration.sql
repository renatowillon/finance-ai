-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "repete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repeteId" TEXT,
ADD COLUMN     "repetePeriodo" INTEGER,
ADD COLUMN     "repeteQtd" INTEGER;
