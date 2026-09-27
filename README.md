<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" alt="ShopMood Logo" width="80" />
  <h1>🛍️ ShopMood — E-Commerce Platform &amp; REST API</h1>
  <p><strong>Sheryians Coding School — Assignment 11: Authentication &amp; Product CRUD APIs</strong></p>
  <p>A full-stack production-grade MERN e-commerce application featuring robust dual-token JWT authentication (Access + Refresh tokens), server-side token revocation, express-validator validation across all endpoints, complete Product CRUD with Cloudinary image processing, Google Stitch modern UI/UX frontend, real-time search, and a persistent wishlist.</p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node" />
    <img src="https://img.shields.io/badge/Express-5.x-blue.svg" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-brightgreen.svg" alt="MongoDB" />
    <img src="https://img.shields.io/badge/React-18.x%20(CRA)-61dafb.svg" alt="React" />
    <img src="https://img.shields.io/badge/Security-JWT%20%2B%20bcrypt%20(10%20rounds)-orange.svg" alt="Security" />
    <img src="https://img.shields.io/badge/Validation-express--validator-red.svg" alt="Validator" />
  </p>
</div>

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [PRD Core Acceptance Checklist](#-prd-core-acceptance-checklist)
3. [Tech Stack](#-tech-stack)
4. [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
5. [Authentication & Security Architecture](#-authentication--security-architecture)
6. [API Documentation](#-api-documentation)
7. [Frontend Architecture & Pages](#-frontend-architecture--pages)
8. [Installation & Setup Guide](#-installation--setup-guide)
9. [Database Seeding & Default Credentials](#-database-seeding--default-credentials)
10. [Postman API Collection](#-postman-api-collection)
11. [Deployment Guide (Render 1-Click)](#-deployment-guide-render-1-click)
12. [Evaluation & Code Explanation Guide](#-evaluation--code-explanation-guide)

---

## 🎯 Project Overview

**ShopMood** satisfies all requirements of the **Sheryians Coding School Assignment 11 PRD** for building a secure REST API and full-featured frontend.

### Primary Objectives Met:
* **Dual-Token Authentication System:** Short-lived access tokens (15 minutes) passed via `Authorization: Bearer <token>` and long-lived refresh tokens (7 days) issued via `httpOnly`, `secure`, `sameSite` cookies with database persistence for instantaneous revocation.
* **bcrypt Password Hashing:** Minimum 10 salt rounds used for all stored passwords; zero plain-text storage; passwords excluded from API responses (`-password -refreshToken`).
* **express-validator on All Routes:** Every request body, URL route parameter (`:id` MongoID validation), and query parameter is strictly validated before reaching controller logic. Invalid payloads immediately return HTTP `400 Bad Request` with structured field-level errors.
* **Product CRUD Operations:** Complete Create, Read, Update, Delete lifecycle. Read operations (`GET /api/products`, `GET /api/products/:id`) are public; write operations (`POST`, `PUT`, `DELETE`) are strictly guarded by the `authenticate` middleware.
* **Production Frontend:** 18 frontend pages crafted with the Google Stitch design system, featuring AI-generated banners, responsive product grids, real-time live search with autocomplete suggestions, persistent wishlist, Redux shopping cart, and Razorpay/Sandbox checkout.

---

## ✅ PRD Core Acceptance Checklist

| # | PRD Requirement | Status | Implementation Evidence |
|---|---|:---:|---|
| 1 | Register works | ✅ | `POST /api/auth/register` creates user with name, email, password, confirmPassword |
| 2 | Duplicate email returns 409 | ✅ | `authController.js` returns `409 Conflict` if email already exists |
| 3 | Passwords bcrypt-hashed (≥10 rounds) | ✅ | `bcrypt.genSalt(10)` and `bcrypt.hash()` in `authController.js` |
| 4 | Login works | ✅ | `POST /api/auth/login` validates credentials with `bcrypt.compare` |
| 5 | Access token generated (10–15m) | ✅ | Access token signed with `ACCESS_TOKEN_SECRET`, expires in `15m` |
| 6 | Refresh token generated (7d) | ✅ | Refresh token signed with `REFRESH_TOKEN_SECRET`, expires in `7d` |
| 7 | Refresh token persisted in DB | ✅ | Saved to `user.refreshToken` field in MongoDB |
| 8 | Refresh token can be revoked | ✅ | Revoked on logout or token mismatch; validated against DB on each refresh |
| 9 | Authentication middleware implemented | ✅ | `protect` (aliased as `authenticate`) reads Bearer token, verifies JWT, attaches `req.user` |
| 10 | `/me` protected | ✅ | `GET /api/auth/me` requires valid Bearer token; returns user profile |
| 11 | Logout invalidates token | ✅ | `POST /api/auth/logout` sets `user.refreshToken = undefined` and clears cookie |
| 12 | Product create protected | ✅ | `POST /api/products` guarded by `protect` middleware |
| 13 | Product list public | ✅ | `GET /api/products` accessible without authentication |
| 14 | Product details public | ✅ | `GET /api/products/:id` accessible without authentication |
| 15 | Product update protected | ✅ | `PUT /api/products/:id` guarded by `protect` middleware |
| 16 | Product delete protected | ✅ | `DELETE /api/products/:id` guarded by `protect` middleware |
| 17 | `express-validator` used everywhere | ✅ | Registered on all auth routes, product body routes, and `:id` params |
| 18 | Invalid input returns 400 | ✅ | `validationMiddleware.js` halts pipeline and returns `400` on validation errors |
| 19 | Field-level validation errors returned | ✅ | Response format: `{ message, errors: [{ field, message }] }` |
| 20 | Product IDs validated before DB query | ✅ | `param("id").isMongoId()` on all `/:id` routes |
| 21 | Frontend implemented | ✅ | Complete React frontend with 18 pages and full API consumption |
| 22 | README included | ✅ | This comprehensive README documentation |
| 23 | Backend + frontend in one repo | ✅ | Monorepo structure with root orchestration |
| 24 | GitHub & Live Links provided | ✅ | Ready for submission |

---

## 🛠 Tech Stack

### Backend
* **Runtime & Framework:** Node.js, Express.js `5.x`
* **Database & ODM:** MongoDB, Mongoose `9.x`
* **Security & Auth:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs` (10 rounds), `cookie-parser`
* **Validation:** `express-validator` `7.x`
* **File Uploads & Media:** `multer`, Cloudinary SDK `2.x`
* **Payment Integration:** Razorpay SDK `2.x`
* **Email Service:** Nodemailer `10.x` (fire-and-forget discount/welcome OTP notification)

### Frontend
* **UI Library:** React.js `18.x` (Create React App / `react-scripts 5.x`)
* **Routing:** React Router DOM `6.x`
* **State Management:** Redux Toolkit (Shopping Cart), Context API (`AuthContext`, `WishlistContext`)
* **Styling:** Custom CSS Design System (`modern-ui.css`, `product.css`, `navbar.css`, `auth.css`, `cart.css`) following Google Stitch guidelines
* **API Communication:** Custom `apiFetch` service with automatic access token refresh queue on HTTP 401

---

## 📁 Project Architecture & Directory Structure

```text
shopmood/
├── package.json                          # Root package.json with concurrent run scripts
├── README.md                             # Comprehensive PRD & project documentation
├── ShopMood_Postman_Collection.json      # Full Postman API testing collection
│
├── backend/
│   ├── .env                              # Environment configuration (secrets, DB URI)
│   ├── package.json                      # Backend dependencies & scripts
│   ├── server.js                         # Express entrypoint, middleware, routes mount
│   ├── seed.js                           # Database seeding script (10 products + Admin user)
│   │
│   ├── config/
│   │   ├── db.js                         # Mongoose connection (MONGODB_URI / MONGO_URI)
│   │   └── cloudinary.js                 # Cloudinary media storage configuration
│   │
│   ├── models/
│   │   ├── User.js                       # User schema (name, email, password, refreshToken, role)
│   │   ├── Product.js                    # Product schema (name, price, stock, imageUrl, ratings, reviews)
│   │   └── Order.js                      # Order schema (items, totalAmount, address, paymentId, status)
│   │
│   ├── controllers/
│   │   ├── authController.js             # Register, Login, RefreshToken, Logout, GetMe, GetUsers
│   │   ├── productController.js          # CRUD controllers, Cloudinary upload, search query filters
│   │   ├── orderController.js            # Order placement, user orders, admin status update
│   │   ├── paymentController.js          # Razorpay order generation & signature verification
│   │   └── analyticsController.js        # Admin metrics (revenue, orders, products, users)
│   │
│   ├── routes/
│   │   ├── authRoutes.js                 # /api/auth routes with express-validator
│   │   ├── productRoutes.js              # /api/products routes with param & body validators
│   │   ├── orderRoutes.js                # /api/orders routes
│   │   ├── paymentRoutes.js              # /api/payment routes
│   │   └── analyticsRoutes.js            # /api/analytics routes
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js             # protect & authenticate JWT verification middleware
│   │   ├── adminMiddleware.js            # admin role guard (returns 403 Forbidden)
│   │   └── validationMiddleware.js       # express-validator result handler (returns 400 Bad Request)
│   │
│   └── utils/
│       └── sendEmail.js                  # Nodemailer utility
│
└── frontend/
    ├── package.json                      # Frontend dependencies (proxy to port 5000)
    │
    ├── public/
    │   ├── index.html                    # HTML template
    │   ├── ShopMoodLogo.png              # Brand icon
    │   ├── dp.jpg                        # Founder portfolio picture
    │   └── images/
    │       ├── hero-banner.jpg           # High-resolution AI-generated hero banner
    │       ├── special-offer.jpg         # High-resolution AI-generated promo banner
    │       └── products/                 # High-resolution AI-generated product photography
    │           ├── smartwatch.jpg
    │           ├── keyboard.jpg
    │           ├── backpack.jpg
    │           ├── earbuds.jpg
    │           ├── headphones.jpg
    │           └── sneakers.jpg
    │
    └── src/
        ├── App.jsx                       # Top-level route switch (18 pages)
        ├── index.js                      # Provider mounting (Redux, Auth, Wishlist)
        │
        ├── context/
        │   ├── AuthContext.jsx           # JWT session, /api/auth/me verification, centralized logout
        │   └── WishlistContext.jsx       # App-wide wishlist state, toggle & localStorage sync
        │
        ├── redux/
        │   ├── store.js                  # Redux store configuration
        │   └── cartSlice.js              # Shopping cart actions (add, remove, qty, clear)
        │
        ├── services/
        │   └── api.js                    # apiFetch client with transparent 401 token refresh queue
        │
        ├── components/
        │   ├── Navbar.jsx                # Sticky header, search with live autocomplete, wishlist & cart badges
        │   ├── Footer.jsx                # Multi-column footer with newsletter & payment badges
        │   └── ProductCard.jsx           # Interactive card with wishlist heart, star rating, quick-add
        │
        ├── pages/
        │   ├── Home.jsx                  # Homepage with Hero, Categories, Trending, Offer, Reviews
        │   ├── Shop.jsx                  # Filterable catalog by category, search & sorting
        │   ├── ProductDetail.jsx         # Full product view, specs, stock dot, Add to Cart & Buy Now
        │   ├── Cart.jsx                  # Shopping bag, free shipping meter, promo coupon engine
        │   ├── Wishlist.jsx              # Dedicated wishlist page with "Move to Cart" action
        │   ├── Checkout.jsx              # 2-column shipping & Razorpay/Sandbox checkout
        │   ├── OrderSuccess.jsx          # Order confirmation & delivery receipt
        │   ├── Login.jsx                 # Login form with show/hide password & demo autofill
        │   ├── Register.jsx              # Registration form with live password requirement checklist
        │   ├── Profile.jsx               # User profile, total spend metrics & order history
        │   ├── About.jsx                 # Brand story, company values, founder portfolio
        │   ├── ReturnPolicy.jsx          # 30-day return policy breakdown
        │   └── Disclaimer.jsx            # Demonstrative sandbox & portfolio disclaimer
        │
        ├── admin/
        │   ├── AdminDashboard.jsx        # KPI metric cards (Revenue, Orders, Products, Users)
        │   ├── AdminProducts.jsx         # Inventory table with search, stock badges, edit & delete
        │   ├── AddProduct.jsx            # Create product with Cloudinary image upload & preview
        │   ├── EditProduct.jsx           # Edit product details with existing values & replacement image
        │   ├── AdminOrders.jsx           # Customer orders management with status dropdown selector
        │   └── AdminUsers.jsx            # User accounts directory with role indicators
        │
        └── styles/
            ├── global.css                # Base reset, typography, and scrollbars
            ├── modern-ui.css             # Google Stitch unified design system components
            ├── navbar.css                # Sticky navbar & live autocomplete search styles
            ├── product.css               # Hero banner, product grid, card, and detail styling
            ├── auth.css                  # Modern authentication cards and password strength meters
            └── cart.css                  # Shopping bag, shipping progress meter, and checkout styling
```

---

## 🔐 Authentication & Security Architecture

### Dual-Token JWT Architecture

```text
[ Client (React) ]                                  [ Server (Express) ]                 [ MongoDB ]
        |                                                     |                               |
        |--- 1. POST /api/auth/login ------------------------>|                               |
        |    { email, password }                              |--- 2. bcrypt.compare -------->|
        |                                                     |                               |
        |                                                     |--- 3. Generate Tokens:        |
        |                                                     |       - Access (15m, JWT)     |
        |                                                     |       - Refresh (7d, JWT)     |
        |                                                     |--- 4. Save refreshToken ----->|
        |                                                     |                               |
        |<-- 5. Response: ------------------------------------|                               |
        |    - Body: { token: accessToken, _id, name, ... }   |                               |
        |    - Set-Cookie: refreshToken=...; httpOnly; Secure |                               |
        |                                                     |                               |
        |=== Subsequent Protected Requests ===================|                               |
        |--- 6. GET /api/products (POST/PUT/DELETE) --------->|                               |
        |    Headers: Authorization: Bearer <accessToken>     |--- 7. jwt.verify(accessToken) |
        |                                                     |                               |
        |=== On Access Token Expiry (HTTP 401) ===============|                               |
        |--- 8. POST /api/auth/refresh-token ---------------->|                               |
        |    Cookie: refreshToken=<httpOnlyToken>             |--- 9. Verify JWT              |
        |                                                     |--- 10. Check against DB ----->|
        |                                                     |        (Revocation Check)     |
        |<-- 11. Response: { token: newAccessToken } ---------|                               |
        |--- 12. Retry original request seamlessly ---------->|                               |
        |                                                     |                               |
        |=== On Logout =======================================|                               |
        |--- 13. POST /api/auth/logout ---------------------->|--- 14. user.refreshToken=null>|
        |<-- 15. clearCookie("refreshToken") -----------------|                               |
```

### Security Measures Implemented
1. **Password Encryption:** Hashed with `bcryptjs` using 10 salt rounds. Plaintext is never saved or logged.
2. **Field Stripping:** User queries explicitly use `.select("-password -refreshToken")` so hashes never leak into responses.
3. **httpOnly Cookie Protection:** Refresh tokens are stored in `httpOnly`, `secure` (in production), and `sameSite` cookies, making them inaccessible to client-side XSS scripts.
4. **Token Revocation:** Each refresh token is recorded in the MongoDB `User` document. If a token is revoked (on logout or account compromise), any future refresh attempts with that token fail with HTTP `403 Forbidden`.
5. **Generic Login Errors:** Invalid credentials return generic `"Invalid credentials"` (HTTP 401) to prevent user enumeration attacks.
6. **No Token on Register:** Per PRD specification, registration creates the account and returns user data without issuing tokens; users must explicitly log in.

---

## 📡 API Documentation

### Base URL
* Local Development: `http://localhost:5000`
* Production: `https://<your-render-url>.onrender.com`

---

### 1. Authentication Endpoints (`/api/auth`)

#### `POST /api/auth/register`
* **Access:** Public
* **Validation Rules:**
  * `name`: Required, trimmed, non-empty.
  * `email`: Valid email format, normalized.
  * `password`: Minimum 6 characters, must contain at least one numeric digit (`/\d/`).
  * `confirmPassword`: Must match `password`.
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }
  ```
* **Success Response (`201 Created`):**
  ```json
  {
    "_id": "67fc10776358a0393a221b3d",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
  ```
* **Error Responses:**
  * `400 Bad Request` — Validation error(s):
    ```json
    {
      "message": "Validation failed",
      "errors": [{ "field": "password", "message": "Password must contain at least one number" }]
    }
    ```
  * `409 Conflict` — Email already registered:
    ```json
    { "message": "User already exists" }
    ```

#### `POST /api/auth/login`
* **Access:** Public
* **Validation Rules:** `email` must be valid; `password` is required.
* **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
* **Success Response (`200 OK`):**
  * *Headers:* `Set-Cookie: refreshToken=<token>; HttpOnly; Path=/; SameSite=Lax`
  * *Body:*
    ```json
    {
      "_id": "67fc10776358a0393a221b3d",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
    ```
* **Error Response (`401 Unauthorized`):**
  ```json
  { "message": "Invalid credentials" }
  ```

#### `POST /api/auth/refresh-token`
* **Access:** Public (requires refresh token in cookie or request body)
* **Description:** Verifies refresh token against `REFRESH_TOKEN_SECRET` and checks MongoDB for revocation. If valid, generates a fresh 15-minute access token.
* **Success Response (`200 OK`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
* **Error Responses:**
  * `401 Unauthorized` — `{ "message": "Refresh token required" }` or `{ "message": "Invalid or expired refresh token" }`
  * `403 Forbidden` — `{ "message": "Refresh token revoked or invalid" }`

#### `POST /api/auth/logout`
* **Access:** Authenticated (works with Bearer token or expired token with active cookie)
* **Description:** Invalidates `user.refreshToken` in MongoDB and clears the `refreshToken` httpOnly cookie.
* **Success Response (`200 OK`):**
  ```json
  { "message": "Logged out successfully" }
  ```

#### `GET /api/auth/me`
* **Access:** Authenticated (`Authorization: Bearer <accessToken>`)
* **Success Response (`200 OK`):**
  ```json
  {
    "_id": "67fc10776358a0393a221b3d",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "createdAt": "2026-09-27T10:00:00.000Z"
  }
  ```

#### `GET /api/auth/users`
* **Access:** Authenticated + Admin (`Authorization: Bearer <accessToken>`)
* **Success Response (`200 OK`):** Returns array of all registered users without passwords.

---

### 2. Product Endpoints (`/api/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | **Public** | List all products (supports `?keyword=` and `?category=`) |
| `GET` | `/api/products/:id` | **Public** | Get single product by MongoID |
| `POST` | `/api/products` | **Authenticated** | Create a new product (Multipart or JSON `imageUrl`) |
| `PUT` | `/api/products/:id` | **Authenticated** | Update product (partial payload allowed via `.optional()`) |
| `DELETE` | `/api/products/:id` | **Authenticated** | Remove product from inventory |

#### `POST /api/products`
* **Access:** Authenticated (`Authorization: Bearer <accessToken>`)
* **Headers:** `Content-Type: multipart/form-data` or `application/json`
* **Validation Rules:**
  * `name`: Required, non-empty string.
  * `description`: Required, non-empty string.
  * `price`: Non-negative floating-point number (`min: 0`).
  * `category`: Required, non-empty string.
  * `stock`: Non-negative integer (`min: 0`).
  * Image: Uploaded file via Multer (stored to Cloudinary) or JSON `imageUrl`.
* **Success Response (`201 Created`):**
  ```json
  {
    "_id": "6ab92bd74765cfeeb853c3f8",
    "name": "Horizon Pro Smartwatch",
    "description": "Next-gen AMOLED touchscreen with sapphire crystal glass...",
    "price": 249.99,
    "category": "Electronics",
    "stock": 25,
    "imageUrl": "/images/products/smartwatch.jpg",
    "ratings": 4.9,
    "numReviews": 48
  }
  ```

#### `GET /api/products/:id`
* **Validation:** Validates `:id` is a valid MongoDB ObjectId before querying (`param("id").isMongoId()`).
* **Error Response (`404 Not Found`):** `{ "message": "Product not found" }`

#### `PUT /api/products/:id`
* **Access:** Authenticated (`Authorization: Bearer <accessToken>`)
* **Validation:** All fields optional; if supplied, price and stock must be non-negative numbers.

#### `DELETE /api/products/:id`
* **Access:** Authenticated (`Authorization: Bearer <accessToken>`)
* **Success Response (`200 OK`):** `{ "message": "Product removed" }`

---

## 💻 Frontend Architecture & Pages

The frontend includes **18 functional pages** matching the Google Stitch design guidelines:

### Storefront & Shopping Pages
1. **Home (`/`)** — AI-generated Hero banner, Shop by Category, Trending Products with client-side filter pills, Special Offer 50% Off banner, and Verified Customer Reviews.
2. **Shop (`/shop`)** — Filterable catalog by category, live keyword search, price & rating sort controls.
3. **Product Detail (`/product/:id`)** — Category breadcrumbs, high-resolution showcase, live in-stock badge, quantity selector, and instant Buy Now checkout.
4. **Shopping Cart (`/cart`)** — Step indicator, free express shipping progress bar, promo coupon code engine (`MOOD20`), and quantity controls.
5. **Wishlist (`/wishlist`)** — Dedicated saved items page with "Move to Cart 🛒" and individual remove controls.
6. **Checkout (`/checkout`)** — 2-column layout with shipping form, Razorpay payment gateway, and Instant Sandbox Test Mode.
7. **Order Success (`/ordersuccess`)** — Animated confirmation checkmark, estimated delivery date, and order receipt summary.
8. **About Us (`/about`)** — Brand story, company values, statistics, and founder portfolio showcase.
9. **Return Policy (`/return`)** — 30-day hassle-free return and refund guidelines.
10. **Legal Disclaimer (`/disclaimer`)** — Educational portfolio and sandbox environment terms.

### Authentication & Account Pages
11. **Login (`/login`)** — Modern authentication card with show/hide password toggle and one-click Admin demo autofill.
12. **Register (`/register`)** — Signup form with real-time password strength checklist and match feedback.
13. **Profile (`/profile`)** — User account info, lifetime spend metrics, admin panel launcher, and past order receipts.

### Admin Suite Pages
14. **Admin Dashboard (`/admin`)** — Real-time KPI metric cards (Gross Revenue, Total Orders, Live Products, Registered Users) and quick action tiles.
15. **Manage Products (`/admin/products`)** — Full catalog table with search, stock alert badges, and Edit / Delete actions.
16. **Add Product (`/admin/add-product`)** — Product creation form with image upload dropzone and live preview.
17. **Edit Product (`/admin/edit-product/:id`)** — Inventory editor pre-populated with current details and image replacement option.
18. **Manage Orders (`/admin/orders`)** — Orders fulfillment table with status filter pills and status updater (*Pending / Shipped / Delivered*).
19. **User Directory (`/admin/users`)** — Registered user directory with search and role badges (*Admin / Customer*).

---

## 🚀 Installation & Setup Guide

### Prerequisites
* **Node.js** (v18.x or higher)
* **MongoDB** (Local instance or MongoDB Atlas cluster connection string)
* **npm** or **yarn**

### 1. Clone & Install Dependencies
From the repository root, install dependencies for root, backend, and frontend:
```bash
# Clone repository
git clone https://github.com/your-username/shopmood.git
cd shopmood

# Option A: One-step install via root script
npm run install-all

# Option B: Manual install
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Environment Variables Configuration
Create a `.env` file in the `backend/` directory:
```bash
# backend/.env
PORT=5000
NODE_ENV=development

# Database connection (supports MONGODB_URI or MONGO_URI)
MONGODB_URI=mongodb://127.0.0.1:27017/shopmood

# JWT Secrets (Generate random 64-character hex strings)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_min_32_chars
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here_min_32_chars

# Cloudinary Storage (For image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Payments (Optional for live keys, Sandbox test mode available)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL (For CORS whitelist)
FRONTEND_URL=http://localhost:3000
```

### 3. Seed Database
Populate MongoDB with 10 catalog items (including custom AI-generated photography) and the default Administrator account:
```bash
npm run seed
```

### 4. Run Locally
Start both backend (Port 5000) and frontend (Port 3000) simultaneously with one command from the project root:
```bash
npm run dev
```

* Frontend Storefront: `http://localhost:3000`
* Backend API: `http://localhost:5000`

---

## 👤 Database Seeding & Default Credentials

Running `npm run seed` resets and populates MongoDB with:

### Default Administrator Account
* **Email:** `admin@shopmood.com`
* **Password:** `password123`
* **Role:** `admin` (Has full access to `/admin` dashboard, orders, and user directory)

### Active Catalog (10 Products)
1. **Horizon Pro Smartwatch** (Electronics) — ₹249.99
2. **KeyCraft Custom Mechanical Keyboard** (Electronics) — ₹159.00
3. **Heritage Artisan Leather Backpack** (Accessories) — ₹189.50
4. **Aura Sound ANC Wireless Earbuds** (Electronics) — ₹129.99
5. **StudioMaster Wireless ANC Headphones** (Electronics) — ₹299.00
6. **Aurora Velocity Running Sneakers** (Footwear) — ₹119.99
7. **Wireless Noise-Cancelling Headphones** (Electronics) — ₹299.99
8. **Minimalist Modern Chair** (Furniture) — ₹150.00
9. **Professional DSLR Camera** (Electronics) — ₹1,199.99
10. **Classic White Sneakers** (Clothing) — ₹85.00

---

## 📮 Postman API Collection

The repository includes a ready-to-import testing collection: **`ShopMood_Postman_Collection.json`**.

### How to Use:
1. Open **Postman** → Click **Import** → Select `ShopMood_Postman_Collection.json`.
2. The collection has pre-configured folders:
   * **AUTH** (`Register`, `Login`, `Refresh Token`, `Logout`, `Get Profile /me`, `Get All Users`)
   * **PRODUCTS** (`Get All Products`, `Get Product By ID`, `Create Product`, `Update Product`, `Delete Product`)
   * **ORDERS & CHECKOUT**
3. Logging in automatically captures the `token` variable, so protected requests execute seamlessly without manual copy-pasting.

---

## ☁️ Deployment Guide (Render 1-Click)

The repository is configured for single-service full-stack deployment on **Render**:

1. Push your repository to **GitHub**.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Web Service**.
3. Connect your repository.
4. Set the following build configurations:
   * **Environment:** `Node`
   * **Build Command:** `npm run render-build` *(Installs all dependencies and builds React static bundle)*
   * **Start Command:** `npm start` *(Launches Express on `PORT 5000`)*
5. Under **Environment Variables**, add:
   * `NODE_ENV` = `production`
   * `MONGODB_URI` = *your MongoDB Atlas connection string*
   * `ACCESS_TOKEN_SECRET` = *your random secret*
   * `REFRESH_TOKEN_SECRET` = *your random secret*
   * `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
6. Click **Deploy Web Service**. In production, Express automatically serves the compiled React app from `/frontend/build` with SPA fallback.

---

## 🎓 Evaluation & Code Explanation Guide

*(Satisfies PRD Section 6 requirement for technical understanding & viva explanation)*

### 1. How does the Dual-Token JWT Lifecycle work?
* **Access Token (15 mins):** Stored in memory on the client (`AuthContext`) and in `localStorage` for page refresh persistence. Sent as `Authorization: Bearer <token>` on every protected request.
* **Refresh Token (7 days):** Sent as an `httpOnly`, `secure` cookie. Inaccessible via JavaScript, shielding it from XSS.
* **Auto-Refresh Queue (`frontend/src/services/api.js`):** When any API call receives a `401 Unauthorized`, `apiFetch` intercepts it, calls `POST /api/auth/refresh-token`, obtains a fresh access token, updates `localStorage`, and replays the original failed request without interrupting the user.

### 2. How are requests validated before controllers?
* Using `express-validator` middleware chains (e.g., in `authRoutes.js` and `productRoutes.js`).
* `validationMiddleware.js` calls `validationResult(req)`. If errors exist, it immediately short-circuits execution and returns HTTP `400` with an array of specific `{ field, message }` items, preventing malformed data from ever touching the controller or database.

### 3. How does Product Image Upload work?
* Multer parses `multipart/form-data` uploads into temporary files under `uploads/`.
* `productController.js` sends the file to Cloudinary, extracts the secure HTTPS URL, and stores it in MongoDB.
* A `finally` block ensures the temporary upload file on disk is deleted via `fs.unlink`, preventing server storage leaks.

### 4. Why is the Monorepo structured with `concurrently`?
* Root `package.json` allows developers to run both frontend and backend concurrently with `npm run dev` during local development, while supporting unified production building via `npm run render-build`.

---

<div align="center">
  <p>Crafted with ❤️ for <strong>Sheryians Coding School</strong> Assignment 11.</p>
  <p>© 2026 ShopMood. All rights reserved.</p>
</div>
