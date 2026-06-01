-- schema.sql – database schema for BidBazaar Auction Platform

-- Users table (already used by existing code)
CREATE TABLE IF NOT EXISTS "User_dtls" (
    "UserId" SERIAL PRIMARY KEY,
    "UserUserName" VARCHAR(100) UNIQUE NOT NULL,
    "UserPassword" VARCHAR(100) NOT NULL,
    "UserRole" VARCHAR(50) NOT NULL,
    "UserFirstName" VARCHAR(100) NOT NULL,
    "UserLastName" VARCHAR(100) NOT NULL,
    "UserPhoneNumber" VARCHAR(20) NOT NULL,
    "UserEmail" VARCHAR(150),
    "UserAddress" TEXT,
    "UserIdentity" VARCHAR(100),
    "PhotoPath" VARCHAR(255)
);

-- Products table – stores auction items posted by sellers
CREATE TABLE IF NOT EXISTS "products" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "price" NUMERIC(12,2) NOT NULL,
    "description" TEXT NOT NULL,
    "seller_id" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: add an index on seller_id for faster look‑ups
CREATE INDEX IF NOT EXISTS idx_products_seller ON "products" ("seller_id");
