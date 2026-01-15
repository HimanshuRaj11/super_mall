# Super Mall Web Application

A full-stack e-commerce mall management system built with Next.js 14, TypeScript, Tailwind CSS, and MongoDB.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Lucide React.
- **Backend:** Next.js API Routes, Mongoose (MongoDB).
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly cookies, Bcrypt for hashing.
- **Validation:** Zod schemas.
- **Logging:** Custom MongoDB-based logging system.

## ✨ Features

### 👤 User (Customer) Module
- **Homepage:** Featured shops, trending offers, and category browsing.
- **Shop Listing:** Filter shops by Category and Floor level.
- **Shop Detail:** View shop products, active offers, and contact info.
- **Product Comparison:** Compare up to 3 products side-by-side.
- **Responsive Design:** Mobile-first UI with premium aesthetics.

### 🏪 Merchant Module
- **Dashboard:** Overview of shop status and quick actions.
- **Shop Profile:** Create and manage shop details (Name, Floor, Category).
- **Product Management:** Add, Edit, Delete products with image support.
- **Offer Management:** Create time-bound discount offers.

### 🛡️ Admin Module
- **Dashboard:** System-wide analytics (Total Users, Shops, Sales).
- **Shop Management:** Approve/Disable merchant shops.
- **User Management & Logs:** (Backend prepared for extension).

## 🛠️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/super-mall.git
    cd super-mall
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/super_mall
    JWT_SECRET=your_super_secret_key_change_this_in_production
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user (Merchant/User).
- `POST /api/auth/login` - Login and receive JWT cookie.
- `GET /api/auth/me` - Get current session user.

### Public
- `GET /api/shops` - List active shops with filters.
- `GET /api/shops/[id]` - Get shop details.
- `GET /api/products` - List products (by shopId).
- `GET /api/offers` - List offers (by shopId).

### Merchant (Protected)
- `GET/POST /api/merchant/shop` - Manage own shop.
- `POST /api/products` - Create product.
- `POST /api/offers` - Create offer.

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard stats.
- `GET /api/admin/shops` - List all shops (pending/active).
- `PATCH /api/admin/shops/[id]` - Approve/Reject shop.

## 🧪 Testing

The application includes unit tests and uses strict Zod validation for all inputs.
- Run linting: `npm run lint`
- Run build check: `npm run build`

## 📂 Project Structure

- `src/app/` - App Router pages and API routes.
- `src/components/` - Reusable UI components (Shadcn).
- `src/lib/` - DB connection, Auth utilities.
- `src/models/` - Mongoose Schemas.
- `src/services/` - Business logic helpers (Logger).
