-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Upload" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uId" INTEGER,
    "newFilename" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Upload" ("createdAt", "filepath", "id", "mimetype", "newFilename", "originalFilename", "uId") SELECT "createdAt", "filepath", "id", "mimetype", "newFilename", "originalFilename", "uId" FROM "Upload";
DROP TABLE "Upload";
ALTER TABLE "new_Upload" RENAME TO "Upload";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
