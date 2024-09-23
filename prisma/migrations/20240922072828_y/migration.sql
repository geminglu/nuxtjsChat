-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "microsoftOid" TEXT
);
INSERT INTO "new_User" ("avatar", "createdAt", "id", "microsoftOid", "name", "updatedAt") SELECT "avatar", "createdAt", "id", "microsoftOid", "name", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_microsoftOid_key" ON "User"("microsoftOid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
