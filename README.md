<p align="center">
  <h1 align="center">⚙️ CakraPay API</h1>
</p>

<p align="center">
  <strong>A robust Core Banking System for managing digital wallets and transactions.</strong>
</p>

<p align="center">
  <a href="https://cakrapay-vocagame.vercel.app/">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-VISIT%20SITE-blueviolet?style=for-the-badge" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/badge/LICENSE-MIT-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,express,ts,postgres,prisma,docker,git" />
  </a>
</p>

---

<p align="center">
  Built with the modern stack for <strong>Vocagame</strong>.<br/>
  Focusing on clean architecture, financial precision, and a robust testing suite.
</p>

A premium, high-performance Core Banking API built with **Node.js**, **Express**, and **Prisma**. This project was developed as a technical home test for **Vocagame**, focusing on clean architecture, ACID compliance, and a comprehensive testing suite.

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Dockerized)
- **Validation:** [Zod](https://zod.dev/)
- **Math Engine:** [Decimal.js](https://mikemcl.github.io/decimal.js/) (Handling floating-point issues)

## ✨ Key Features

1.  **Wallet Management:** Creation of wallets per currency per user.
2.  **Top-up:** Balance addition with precise decimal validation.
3.  **Payment:** Balance deduction for shopping transactions with insufficient balance checks.
4.  **Atomic Transfer:** Fund movement between wallets with guaranteed atomic transactions (ACID).
5.  **Wallet Suspension:** Wallet freezing feature to prevent transaction operations.
6.  **Audit Trail (Ledger):** Every balance change is permanently recorded in the Ledger table as the Source of Truth.
7.  **Idempotency:** Protection against duplicate transactions using `reference_id`.

## 🚀 How to Run

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- Yarn or NPM

### Installation Steps
1.  **Clone Repository**
    ```bash
    git clone https://github.com/WisnuCakraa/cakrapay-api.git
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

## 📊 API Documentation & UAT

| Feature | Method | Endpoint | UAT Scenario | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **Create Wallet** | POST | `/api/wallets` | Create a new wallet (USD) | 201 Created |
| **Top-up** | POST | `/api/wallets/:id/topup` | Input positive balance | Balance & Ledger increase |
| **Payment** | POST | `/api/wallets/:id/payment` | Pay exceeding balance | 400 Insufficient Balance |
| **Transfer** | POST | `/api/wallets/transfer` | Send balance between users | Wallet A decreases, B increases |
| **Suspend** | PATCH | `/api/wallets/:id/status` | Change status to SUSPENDED | Subsequent transactions blocked |
| **Inquiry** | GET | `/api/wallets/:id` | Check current balance | Balance detail & status appear |
| **History** | GET | `/api/wallets/:id/transactions` | View account mutations | Transaction list (descending) |

## 📂 Testing Evidence

Detailed evidence of edge cases and full testing scenarios can be found in the following PDF document:

[📄 **Edge Cases Documentation - Wisnu.pdf**](./docs/file/Edge%20Cases%20-%20Docs%20Wisnu.pdf)

---

## 🧪 Unit Test (Jest)

To run unit tests, use: `yarn test --coverage`

![Unit Test Screenshot](./docs/screenshots/unit-test.png)

## 🏗️ Design Principles

- **Financial Precision:** Using `Decimal.js` to avoid IEEE 754 issues (e.g., 0.1 + 0.2 != 0.3).
- **Transactional Safety:** Using `prisma.$transaction` to ensure transfer operations do not "hang" if one side fails.
- **Immutability:** Data in the `Ledger` table can only be added (Insert), not modified (Update) or deleted (Delete) to maintain audit integrity.

---
Developed by **Wisnu Cakra Basudewa Prasodjo**
