-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('TOPUP', 'PAYMENT', 'TRANSFER_IN', 'TRANSFER_OUT');

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "balance" DECIMAL(19,4) NOT NULL DEFAULT 0.00,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "transaction_type" "TxType" NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" TEXT NOT NULL,
    "reference_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_owner_id_currency_key" ON "Wallet"("owner_id", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_reference_id_key" ON "Ledger"("reference_id");

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
