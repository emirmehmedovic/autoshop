-- Add internal purchase cost tracking for products and order item snapshots.
ALTER TABLE "Product" ADD COLUMN "purchasePrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "OrderItem" ADD COLUMN "purchasePrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
