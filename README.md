# StarShop - Online Shopping Website Backend

This is the backend for the "StarShop" online shopping website, built with NodeJS, Express, and Sequelize (Code First) for MySQL.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Users](#users)
  - [Products](#products)
  - [Orders](#orders)
  - [Stats (Admin Only)](#stats-admin-only)
  - [Swagger UI](#swagger-ui)

## Features

- User authentication (register, login) with JWT.
- Password hashing with Bcrypt.
- Role-based authorization (admin, user).
- CRUD operations for products (admin).
- Order creation and management.
- Shopping cart functionality.
- Product categories.
- Admin statistics (total revenue, monthly revenue, top-selling products).

## Technology Stack

- NodeJS
- Express
- Sequelize ORM (MySQL)
- JSON Web Token (JWT)
- Bcrypt
- Express-validator
- Dotenv

## Project Structure

```
/src
  /config           # Sequelize configuration
  /models           # Sequelize models (Code First)
    - cart.js
    - cartItem.js
    - category.js
  /migrations       # Database migrations (optional, as we use sync for simplicity)
  /seeders          # Sample data seeders
  /controllers      # Request handlers
  /services         # Business logic
  /routes           # API routes
  /middlewares      # Authentication and authorization middleware
  /utils            # Utility functions (e.g., database sync)
/server.js        # Main application file
/package.json
/package-lock.json
/.env.example
/README.md
```

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or higher) installed
- MySQL server running (e.g., XAMPP, Docker, local installation)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd StarShop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root based on `.env.example` and fill in your database credentials and JWT secret.

Example `.env`:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=starshop_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

**Note:** If you don't see `.env.example`, you may need to create it manually with the content above.

### Database Setup

This project uses Sequelize for database management. Ensure you have `sequelize-cli` installed locally or globally (`npm install -g sequelize-cli`).

1.  **Create an empty MySQL database** named `starshop_db` (or whatever you configured `DB_NAME` to be) in your MySQL server.

2.  **Configure Sequelize CLI**: A `.sequelizerc` file is provided in the project root to configure `sequelize-cli` to locate models, migrations, and seeders in the `src` directory.

3.  **Run Migrations**: To create and update your database schema, and to add initial categories, run the following command:
    ```bash
    npm run db:migrate
    ```
    *Note: If you encounter foreign key constraint errors when adding `categoryId` to `Products`, ensure you have run the initial category migration successfully and either manually update existing products with a `categoryId` or create a data migration for it. You may need to temporarily make `categoryId` nullable in `src/models/product.js` during initial setup if you have existing product data without categories.* 

4.  **Run Seeders (Optional)**: To populate your database with sample data, including initial categories, run:
    ```bash
    npm run db:seed
    ```
    *Note: The `db:seed` script will also insert initial categories, but the `db:migrate` command for initial categories ensures the table is set up before products are migrated.*

### Running the Application

To start the Express server:

```bash
npm start
```

The server will run on `http://localhost:3000` (or the `PORT` you configured).

## API Endpoints

All API endpoints are prefixed with `/api`.

### 🔐 AUTH

-   `POST /api/auth/register`
    -   Registers a new user.
    -   Request Body: `{ name, email, password }`
    -   Default `role` is "user".
-   `POST /api/auth/login`
    -   Logs in a user and returns an `x-access-token`.
    -   Request Body: `{ email, password }`

### 👤 USERS (Requires `x-access-token`)

-   `GET /api/users` (Admin Only)
    -   Get all users.
-   `GET /api/users/:id`
    -   Get user by ID.
-   `PUT /api/users/:id`
    -   Update user information. Users can only update their own profile unless they are an admin.
    -   Request Body: `{ name?, email?, password?, phone?, address?, age?, avatar? }`
-   `DELETE /api/users/:id` (Admin Only)
    -   Delete a user.

### 🛒 PRODUCTS (Requires `x-access-token` for CRUD, public for GET)

-   `GET /api/products`
    -   Get all products. Supports search by `name`, `categoryId`, `minPrice`, `maxPrice` as query parameters.
    -   Example: `/api/products?name=abc&categoryId=1&minPrice=100&maxPrice=500`
-   `GET /api/products/:id`
    -   Get product by ID.
-   `POST /api/products` (Admin Only)
    -   Create a new product.
    -   Request Body: `{ name, description?, categoryId, price, image?, stock, featured? }`
-   `PUT /api/products/:id` (Admin Only)
    -   Update product information.
    -   Request Body: `{ name?, description?, categoryId?, price?, image?, stock?, featured? }`
-   `DELETE /api/products/:id` (Admin Only)
    -   Delete a product.

### 🛍️ CART (Requires `x-access-token`)

-   `GET /api/cart`
    -   Get the authenticated user's cart.
-   `POST /api/cart`
    -   Add an item to the cart.
    -   Request Body: `{ productId, quantity }`
-   `PUT /api/cart/:productId`
    -   Update the quantity of a product in the cart.
    -   Request Body: `{ quantity }`
-   `DELETE /api/cart/:productId`
    -   Remove a product from the cart.
-   `DELETE /api/cart`
    -   Clear the authenticated user's cart.

### 🏷️ CATEGORIES (Public)

-   `GET /api/categories`
    -   Get all product categories.
-   `GET /api/categories/:id`
    -   Get category by ID.
-   `POST /api/categories` (Admin Only)
    -   Create a new category.
    -   Request Body: `{ name, icon? }`
-   `PUT /api/categories/:id` (Admin Only)
    -   Update category information.
    -   Request Body: `{ name?, icon? }`
-   `DELETE /api/categories/:id` (Admin Only)
    -   Delete a category.

### 📦 ORDERS (Requires `x-access-token`)

-   `POST /api/orders` (User Only)
    -   Create a new order based on cart items.
    -   Request Body: `[{ productId, quantity }]`
-   `GET /api/orders` (User Only)
    -   Get orders for the authenticated user.
-   `GET /api/orders/all` (Admin Only)
    -   Get all orders.
-   `PUT /api/orders/:id/approve` (Admin Only)
    -   Approve an order.
-   `PUT /api/orders/:id/cancel` (Admin Only)
    -   Cancel an order.

### 📊 STATS (Admin Only, Requires `x-access-token`)

-   `GET /api/stats/revenue`
    -   Get total revenue from approved orders.
-   `GET /api/stats/revenue/monthly`
    -   Get monthly revenue from approved orders.
-   `GET /api/stats/products/top-selling`
    -   Get top-selling products. Optional query parameter `limit` (default is 5).

### 📖 Swagger UI

Access the API documentation through Swagger UI at:

```
http://localhost:3000/api-docs
```
