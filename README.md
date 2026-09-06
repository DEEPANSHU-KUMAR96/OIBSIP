# 🍕 OIBSIP Pizza — Full-Stack Gourmet Pizza Delivery Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-oibsip--skh1.onrender.com-success?style=for-the-badge&logo=render&logoColor=white)](https://oibsip-skh1.onrender.com)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Payment-Razorpay_Integration-0C2340?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)

An artisanal, full-stack pizza ordering and inventory management web application developed as part of the **Oasis Infobyte Student Internship Program (OIBSIP)**. Features a custom interactive pizza builder, live inventory tracking, real-time order status tracking, Razorpay payment gateway, and role-based access control (Admin/Customer) with Google OAuth 2.0.

---

## 🌐 Live Deployment & Demo Credentials

- **Live URL**: https://oibsip-skh1.onrender.com

### 🔑 Demo Admin Credentials
| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `admin1234` | Full access to Admin Orders & Inventory Dashboard |
| **Customer** | *Register a new account or Sign In with Google* | Free ordering & order tracking |

---

## ✨ Key Features

### 🍕 1. Interactive Gourmet Pizza Builder
- **Custom Dough & Crusts**: Choose from Thin Crust, Hand-Tossed, Cheese Burst, Multi-Grain, and Stone Hearth Bases.
- **House-Crafted Sauces**: Classic San Marzano Marinara, Spicy Arrabiata, Creamy Truffle Alfredo, and Pesto Genovese.
- **Artisanal Cheeses**: Fresh Fior Di Latte Mozzarella, Smoked Provolone, Aged Cheddar Blend, and Whipped Ricotta.
- **Fresh Garden Veggies**: Black Olives, Jalapeños, Button Mushrooms, Bell Peppers, Caramelized Onions, and Sweet Corn.
- **Dynamic Price Calculation**: Instant real-time subtotal updates with comprehensive visual summary.
- **Mobile Responsive Layout**: Ergonomic controls, sticky bottom price summary, and touch-optimized tab selectors.

### 📦 2. Real-Time Inventory-Aware Ordering
- Orders validate live stock availability before placement.
- Automatic inventory depletion upon successful order confirmation.
- Admin dashboard to track inventory levels, monitor stock status, and trigger restocks.

### 💳 3. Razorpay Payment Gateway Integration
- Test-mode payment workflow with credit/debit cards, UPI, NetBanking, and wallets.
- Secure backend order verification using cryptographic signature verification (HMAC-SHA256).

### 🚚 4. Live Order Lifecycle Tracking
- Multi-step visual order progression timeline:
  `Order Received` ➔ `In the Kitchen` ➔ `Baking in Hearth` ➔ `Out for Delivery` ➔ `Delivered`
- Real-time status modification by administrators from the **Admin Orders** dashboard.

### 🔐 5. Dual-Layer Authentication & Security
- **Email & Password**: Secure registration and login with `bcrypt` salt-hashing and form validation.
- **Google OAuth 2.0**: Single-click social authentication using Google Passport strategy.
- **Dual JWT Token Architecture**: Short-lived Access Token in local storage with auto-refresh via secure HTTP-only cookie.
- **Protected Routes**: Navigation guards ensuring secure customer order histories and restricted admin control panels.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (Vite Bundler) |
| **Styling & Icons** | Tailwind CSS v4, Lucide React, Canvas Confetti |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`), React Redux |
| **Client Routing** | React Router DOM v7 |
| **HTTP Client** | Axios (with credentials & custom interceptors) |
| **Backend Runtime** | Node.js (ES Modules) & Express 5 |
| **Database & ODM** | MongoDB Atlas & Mongoose |
| **Authentication** | Passport.js (`passport-google-oauth20`), JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Payment Gateway** | Razorpay SDK |
| **Deployment** | Render (PaaS) |

---

## 📂 Project Architecture

```plaintext
WebDev-L3-PizzaDelivery/
│
├── Backend/
│   ├── public/                      # Static production bundle served by Express
│   ├── src/
│   │   ├── config/                  # Environment variables and config mappings
│   │   ├── controllers/             # Express route controllers (Auth, Inventory, Orders)
│   │   ├── middleware/              # JWT protection, role checks, and validation
│   │   ├── models/                  # Mongoose data schemas (User, Inventory, Order)
│   │   ├── routes/                  # API endpoints (/api/auth, /api/inventory, /api/orders)
│   │   ├── validators/              # Express-validator schema rules
│   │   └── app.js                   # Express application setup, CORS, passport, and SPA routing
│   ├── server.js                    # Database connection & server entry point
│   ├── package.json                 # Backend dependencies & startup scripts
│   └── .env                         # Server environment variables
│
└── Frontend/
    ├── public/                      # Static assets & favicon
    ├── src/
    │   ├── app/                     # App router, Redux store, protected route guards
    │   ├── features/
    │   │   ├── auth/                # Pages (Login, Register, OAuthSuccess), hooks, Redux slice
    │   │   ├── inventory/           # Inventory API services & state
    │   │   └── order/               # PizzaBuilder, MyOrders, AdminOrders, Navbar, components
    │   ├── index.css                # Tailwind CSS imports & global theme styles
    │   └── main.jsx                 # React root component initialization
    ├── index.html                   # HTML template
    ├── vite.config.js               # Vite config & API proxy configuration
    └── package.json                 # Frontend dependencies & build scripts
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- [Razorpay Test Account](https://dashboard.razorpay.com/) (for Key ID & Secret)
- [Google Cloud Console](https://console.cloud.google.com/) (for OAuth Client ID & Secret)

---

### 2. Clone the Repository
```bash
git clone https://github.com/DEEPANSHU-KUMAR96/OIBSIP.git
cd OIBSIP
```

---

### 3. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   npm install
   ```

2. Create a `.env` file inside `Backend/`:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pizza_delivery
   JWT_SECRET=your_jwt_access_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:3000`.*

---

### 4. Frontend Setup
1. Open a new terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 📡 API Endpoints Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Login with email & password | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |
| `POST` | `/api/auth/refresh` | Refresh access token via cookie | Public |
| `POST` | `/api/auth/logout` | Clear refresh token and sign out | Private |
| `GET` | `/api/auth/google` | Trigger Google OAuth 2.0 sign-in | Public |
| `GET` | `/api/auth/google/callback` | OAuth redirect callback handler | Public |

### Inventory (`/api/inventory`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/inventory` | Retrieve list of available pizza ingredients | Public / User |
| `PUT` | `/api/inventory/:id` | Update ingredient stock levels | Admin |

### Orders (`/api/orders`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Create a new custom pizza order | Customer |
| `POST` | `/api/orders/razorpay` | Initialize Razorpay checkout order | Customer |
| `POST` | `/api/orders/verify-payment` | Cryptographically verify Razorpay signature | Customer |
| `GET` | `/api/orders/my-orders` | Fetch past orders for logged-in user | Customer |
| `GET` | `/api/orders` | Fetch all orders across all users | Admin |
| `PATCH` | `/api/orders/:id/status` | Update live order delivery status | Admin |

---

## 👨‍💻 Author & Acknowledgements

- **Developer**: Deepanshu Kumar ([@DEEPANSHU-KUMAR96](https://github.com/DEEPANSHU-KUMAR96))
- **Internship**: Oasis Infobyte Student Internship Program (OIBSIP) — Web Development & Designing (Level 3 Task)

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).
