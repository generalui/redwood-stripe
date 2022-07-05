-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeAccountId" TEXT,
ADD COLUMN     "stripeOnboardingDone" BOOLEAN NOT NULL DEFAULT false;
