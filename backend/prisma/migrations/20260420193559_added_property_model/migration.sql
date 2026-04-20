-- CreateEnum
CREATE TYPE "RentalCategory" AS ENUM ('HOSTELS_PG', 'VEHICLES');

-- CreateEnum
CREATE TYPE "HostelType" AS ENUM ('SINGLE_BED_ROOM', 'DOUBLE_BED_ROOM', 'HOSTEL', 'FLAT', 'HOUSE', 'APARTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "LunchDinnerOption" AS ENUM ('INCLUDED', 'NOT_AVAILABLE', 'PAY_EXTRA');

-- CreateEnum
CREATE TYPE "RentDuration" AS ENUM ('ONE_DAY', 'ONE_WEEK', 'ONE_MONTH', 'THREE_MONTHS', 'SIX_MONTHS', 'ONE_YEAR');

-- CreateTable
CREATE TABLE "PropertyListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proprietorName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "alternativeMobileNumber" TEXT,
    "email" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "rentalAddress" TEXT NOT NULL,
    "quickRent" BOOLEAN NOT NULL DEFAULT false,
    "rentDurations" "RentDuration"[],
    "rentalCategory" "RentalCategory" NOT NULL,
    "hostelType" "HostelType",
    "surfaceArea" INTEGER,
    "parkingBikeScooter" BOOLEAN NOT NULL DEFAULT false,
    "parkingCar" BOOLEAN NOT NULL DEFAULT false,
    "furnitureBed" BOOLEAN NOT NULL DEFAULT false,
    "furnitureTable" BOOLEAN NOT NULL DEFAULT false,
    "furnitureChair" BOOLEAN NOT NULL DEFAULT false,
    "furnitureBardrove" BOOLEAN NOT NULL DEFAULT false,
    "furnitureAlmirah" BOOLEAN NOT NULL DEFAULT false,
    "furnitureKitchenWare" BOOLEAN NOT NULL DEFAULT false,
    "nearbyPlaces" TEXT,
    "bachelorAllowed" BOOLEAN,
    "cctvAvailable" BOOLEAN,
    "lunchDinnerOption" "LunchDinnerOption",
    "lateNightEntryAllowed" BOOLEAN,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PropertyListing_userId_idx" ON "PropertyListing"("userId");

-- CreateIndex
CREATE INDEX "PropertyListing_rentalCategory_idx" ON "PropertyListing"("rentalCategory");

-- CreateIndex
CREATE INDEX "PropertyListing_status_idx" ON "PropertyListing"("status");

-- AddForeignKey
ALTER TABLE "PropertyListing" ADD CONSTRAINT "PropertyListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
