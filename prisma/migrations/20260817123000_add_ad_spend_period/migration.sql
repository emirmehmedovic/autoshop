-- Allow one ad spend entry to cover a whole reporting period.
ALTER TABLE "AdSpendRecord" ADD COLUMN "dateFrom" TIMESTAMP(3);
ALTER TABLE "AdSpendRecord" ADD COLUMN "dateTo" TIMESTAMP(3);

UPDATE "AdSpendRecord"
SET "dateFrom" = "date",
    "dateTo" = "date"
WHERE "dateFrom" IS NULL
  AND "dateTo" IS NULL;
