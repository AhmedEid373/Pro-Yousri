-- CreateTable
CREATE TABLE "site_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "site_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_content" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "home_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_content" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_content" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "services_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_content" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "portfolio_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_content" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "contact_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_content" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "footer_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "languages_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages_content" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "pages_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages_content" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "messages_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    CONSTRAINT "admin_config_pkey" PRIMARY KEY ("id")
);
