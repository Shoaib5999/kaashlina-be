-- Reconciles schema.prisma (User.phone, User.email nullable — added for MSG91 phone-OTP
-- login) with the migration history, which never got a matching migration upstream in
-- faithful-be (schema drift carried over from the fork).
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
