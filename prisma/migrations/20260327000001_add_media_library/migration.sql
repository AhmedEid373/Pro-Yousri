-- CreateTable
CREATE TABLE "media_library" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "media_library_pkey" PRIMARY KEY ("id")
);
