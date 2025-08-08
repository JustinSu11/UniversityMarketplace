-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "condition" TEXT NOT NULL DEFAULT 'GOOD',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "location" TEXT,
    "images" TEXT,
    "tags" TEXT,
    "sellerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Listing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("createdAt", "description", "id", "priceCents", "sellerId", "title", "updatedAt") SELECT "createdAt", "description", "id", "priceCents", "sellerId", "title", "updatedAt" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE INDEX "Listing_sellerId_idx" ON "Listing"("sellerId");
CREATE INDEX "Listing_category_idx" ON "Listing"("category");
CREATE INDEX "Listing_status_idx" ON "Listing"("status");
CREATE INDEX "Listing_createdAt_idx" ON "Listing"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
