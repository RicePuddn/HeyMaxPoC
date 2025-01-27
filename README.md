# Project: SavePlate

## Overview

The **SavePlate** application is a robust platform that connects sellers and customers for efficient food item trading. Sellers can publish products, view sales reports, and manage their inventory. Customers can browse, search for, and purchase food items while tracking their order history.

## Features

### General

- **Authentication**: Login and registration for both sellers and customers.
- **Role-Based Navigation**: Dynamic dashboards for sellers and customers.

### Seller Features

- **Dashboard**:
  - Publish food items with name, price, description, quantity, and image.
  - View light statistics such as total revenue, unique customers, top product, and returning customers.
- **Manage Products**:
  - Edit and delete food items.
  - Real-time updates for inventory changes.
- **Sales Report**:
  - View detailed transaction data, including revenue, unique customers, and returning customers.
  - Identify top-selling products.

### Customer Features

- **Home Page**:
  - Browse and search for food items with a search bar.
  - View product details, including seller location.
  - Add items to a shopping cart with quantity validation.
- **Shopping Cart**:
  - View all items added to the cart.
  - Edit quantities and delete items.
  - Checkout to finalize purchases.
- **Order History**:
  - View past purchases with details about items, prices, and sellers.

## Installation

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL database
- pnpm (preferred package manager)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/food-marketplace.git
   cd food-marketplace
   ```
2. **Install Dependencies**:
   ```bash
   pnpm install
   ```
3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   DATABASE_URL=your_postgresql_database_url
   JWT_SECRET=your_jwt_secret
   ```
4. **Set Up the Database**:
   - Initialize Prisma:
     ```bash
     pnpm prisma generate
     ```
   - Run Migrations:
     ```bash
     pnpm prisma migrate dev
     ```
   - Seed Data (for the starting accounts):
     ```bash
     node prisma/seed.js     
     ```
5. **Start the Development Server**:
   ```bash
   pnpm dev
   ```
6. **Access the Application**:
   Open `http://localhost:3000` in your browser.

## API Endpoints

### Authentication

- `POST /api/login`: Authenticate users.
- `POST /api/register`: Register new users.

### Seller

- `POST /api/upload-food`: Add a new food item.
- `PATCH /api/food/[id]`: Update an existing food item.
- `DELETE /api/food/[id]`: Delete a food item.
- `GET /api/seller-stats`: Fetch statistics for the seller.

### Customer

- `GET /api/food/get-food-items`: Retrieve all available food items.
- `POST /api/checkout`: Handle cart checkout.
- `GET /api/order-history`: Retrieve customer’s order history.

## Technologies Used

- **Frontend**:
  - Next.js (App Router)
  - Tailwind CSS for styling
- **Backend**:
  - Prisma ORM
  - PostgreSQL database
  - JSON Web Tokens (JWT) for authentication
- **Package Manager**: pnpm

## Key Features Implemented

- **Search Bar**: Real-time search functionality for customers.
- **Dynamic Statistics**: Relevant statistics for sellers based on transactions.
- **Cart Management**: Persistent cart with validation.

## Future Enhancements

- Implement email notifications for order confirmation.
- Add more detailed analytics for sellers, such as sales trends over time.
- Enable customer reviews for products.

## Contributors

- **Ernest Heng**
