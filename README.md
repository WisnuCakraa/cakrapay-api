# Cakrapay API - E-Wallet System

This system implements a simple core banking standard using Node.js, Express, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (Dockerized)
- **Validation:** Zod
- **Math Engine:** Decimal.js (Handling floating-point issues)

## Key Features

1.  **Wallet Management:** Creation of wallets per currency per user.
2.  **Top-up:** Balance addition with precise decimal validation.
3.  **Payment:** Balance deduction for shopping transactions with insufficient balance checks.
4.  **Atomic Transfer:** Fund movement between wallets with guaranteed atomic transactions (ACID).
5.  **Wallet Suspension:** Wallet freezing feature to prevent transaction operations.
6.  **Audit Trail (Ledger):** Every balance change is permanently recorded in the Ledger table as the Source of Truth.
7.  **Idempotency:** Protection against duplicate transactions using `reference_id`.

## How to Run

- Docker & Docker Compose
- Node.js (v18+)
- Yarn or NPM

### Installation Steps
1.  **Clone Repository**
    ```bash
    git clone <repository-url>
    cd cakrapay-api
    ```

2.  **Setup Environment**
    Copy the `.env.example` file to `.env` and adjust the configuration.
    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/cakrapay_db"
    PORT=3000
    ```

3.  **Run Database (Docker)**
    ```bash
    docker-compose up -d
    ```

4.  **Database Migration**
    ```bash
    npx prisma migrate dev
    ```

5.  **Run Application**
    ```bash
    yarn dev
    ```

## API Documentation & UAT (User Acceptance Testing)

| Feature | Method | Endpoint | UAT Scenario | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **Create Wallet** | POST | `/api/wallets` | Create a new wallet (USD) | 201 Created |
| **Top-up** | POST | `/api/wallets/:id/topup` | Input positive balance | Balance & Ledger increase |
| **Payment** | POST | `/api/wallets/:id/payment` | Pay exceeding balance | 400 Insufficient Balance |
| **Transfer** | POST | `/api/wallets/transfer` | Send balance between users | Wallet A decreases, B increases |
| **Suspend** | PATCH | `/api/wallets/:id/status` | Change status to SUSPENDED | Subsequent transactions blocked |
| **Inquiry** | GET | `/api/wallets/:id` | Check current balance | Balance detail & status appear |
| **History** | GET | `/api/wallets/:id/transactions` | View account mutations | Transaction list (descending) |

## Testing Evidence

Detailed evidence of edge cases and full testing scenarios can be found in the following PDF document:

[📄 **Edge Cases Documentation - Wisnu.pdf**](./docs/file/Edge%20Cases%20-%20Docs%20Wisnu.pdf)

Below are some API testing snapshots using Bruno based on edge case conditions:

![Unit Test Coverage](./docs/screenshots/unit-test.png)

---

## API Collection (Bruno)

To facilitate testing, an API collection is included that can be directly imported into the **Bruno** application.

- **File Location:** `/docs/bruno-collection/`
- **How to Import:**
  1. Open the **Bruno** application.
  2. Select **Open Collection** in the top left corner.
  3. Navigate to this project folder at `docs/bruno-collection`.
  4. You can immediately try all available endpoints.

---

## Unit Test (Jest)

To run unit tests, use: `yarn test --coverage`

![Unit Test Screenshot](./docs/screenshots/unit-test.png)

---

## Design Principles

- **Financial Precision:** Using `Decimal.js` to avoid IEEE 754 issues (e.g., 0.1 + 0.2 != 0.3).
- **Transactional Safety:** Using `prisma.$transaction` to ensure transfer operations do not "hang" if one side fails.
- **Immutability:** Data in the `Ledger` table can only be added (Insert), not modified (Update) or deleted (Delete) to maintain audit integrity.

---
Developed by **Wisnu Cakra Basudewa Prasodjo**
