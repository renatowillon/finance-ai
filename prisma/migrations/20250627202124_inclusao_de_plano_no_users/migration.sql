-- CreateEnum
CREATE TYPE "Planos" AS ENUM ('FREE', 'PREMIUM');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "plano" "Planos" NOT NULL DEFAULT 'FREE';
