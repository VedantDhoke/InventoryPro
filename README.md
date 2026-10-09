# InventoryPro

A functional inventory management system built with the MERN stack. InventoryPro allows businesses to manage products, suppliers, and stock levels, with a real-time dashboard showing key inventory statistics.

---

## Features

- **User Authentication** — Register and log in with JWT-based authentication. Sessions persist across page refreshes.
- **Product Management** — Full CRUD with search by name/SKU, filter by category, and filter by stock status
- **Supplier Management** — Full CRUD with referential integrity protection (cannot delete a supplier that has products)
- **Inventory Management** — Stock IN / Stock OUT operations with a full transaction audit trail
- **Stock Validation** — Stock can never go negative. Every stock change creates an inventory transaction record.
- **Dashboard** — Total products, total inventory value, low stock count, out-of-stock count, and recent transactions
- **Protected Routes** — Unauthenticated users are redirected to the login page

---

## Technologies

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite, React Router v6, Axios, react-hot-toast |
| Backend | Node.js, Express.js, Mongoose, jsonwebtoken, bcryptjs, dotenv |
| Database | MongoDB (Atlas or local) |

---

## Project Structure

```
InventoryPro/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── api/                # Axios instance + per-resource API modules
│       ├── components/         # Reusable UI components
│       │   ├── common/         # ProtectedRoute, Sidebar, ConfirmDialog, Spinner
│       │   ├── dashboard/      # StatCard, RecentTransactions
│       │   ├── products/       # ProductForm
│       │   ├── suppliers/      # SupplierForm
│       │   └── inventory/      # StockAdjustmentForm, TransactionTable
│       ├── context/            # AuthContext (JWT + user state)
│       ├── pages/              # LoginPage, RegisterPage, DashboardPage,
│       │                       # ProductsPage, SuppliersPage, InventoryPage
│       └── utils/              # formatCurrency, formatDate, getStockStatus
│
└── server/                     # Express backend
    ├── config/                 # MongoDB connection
    ├── controllers/            # Request handlers per resource
    ├── middleware/             # JWT auth guard, centralized error handler
    ├── models/                 # Mongoose schemas
    │                           # User, Product, Supplier, InventoryTransaction
    ├── routes/                 # Express routers
    ├── services/               # inventoryService — atomic stock adjustment
    └── server.js
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- MongoDB (local) or a MongoDB Atlas account
- npm

### 1. Clone the repository

```bash
git clone <repository-url>
cd InventoryPro
```

### 2. Configure backend environment

```bash
cd server
cp .env
```

Edit `server/.env`:

```
MONGO_URI=mongodb://localhost:27017/inventorypro
JWT_SECRET=your_strong_secret_here
PORT=5000
NODE_ENV=development
```

> For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Install frontend dependencies

```bash
cd ../client
npm install
```

---

## How to Run

Open two terminal windows.

**Terminal 1 — Backend:**

```bash
cd server
node server.js
```

You should see:
```
Server running on port 5000 in development mode
MongoDB connected: <host>
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

Open your browser at `http://localhost:5173`

### Health Check

```
GET http://localhost:5000/api/health
```

---

## Authentication

Users register with a name, email, and password. Passwords are hashed with bcryptjs before being stored. On login, a JWT is issued with a 7-day expiry and stored in `localStorage`. The Axios instance automatically attaches it as a `Bearer` token on every request. On a 401 response, the token is cleared and the user is redirected to the login page.

There are no roles or admin accounts — all registered users have the same access.

---

## AI Tool Used

This project was built using **Kiro** — an AI-powered development environment built on VS Code.

---

## AI Development Experience

1. **Backend API scaffolding** — Kiro generated the complete Express project structure including all controllers, routes, middleware, and Mongoose models in one pass, following a defined architecture spec.

2. **Inventory stock adjustment logic** — Kiro implemented the atomic stock adjustment service using a Mongoose session and transaction, including the insufficient stock guard and the requirement that every stock change creates an audit record without partial writes.

3. **React component and page development** — Kiro built all six page components (Login, Register, Dashboard, Products, Suppliers, Inventory) along with reusable form components, modal dialogs, and the transaction history table.

4. **JWT authentication flow** — Kiro implemented the full auth cycle: bcrypt password hashing, token generation, AuthContext with localStorage rehydration on page refresh, ProtectedRoute, and Axios request/response interceptors for attaching and clearing tokens.

5. **Debugging MongoDB connection issue** — When the server was connecting to localhost instead of Atlas after the `.env` was updated, Kiro diagnosed that `dotenv.config()` reads the file at startup time and the old process needed to be restarted to pick up the new `MONGO_URI`.
