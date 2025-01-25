# SavePlate Project

## Overview

SavePlate is a Real-Time Food Surplus Marketplace Platform designed to connect food businesses with surplus inventory to consumers seeking quality food at reduced prices. This platform aims to reduce food waste while benefiting both food providers and consumers.

## Features

1. **User Roles**:

   - **Customer**: View and purchase available food surplus items.
   - **Seller**: Publish food items and track sales, food savings, and customer engagement.

2. **Key Functionalities**:

   - Real-time Inventory Management
   - Location-based Search
   - Analytics Dashboard for Sellers
   - Secure Authentication with JWT

3. **Technologies Used**:

   - **Frontend**: Next.js, Tailwind CSS, Shadcn UI components
   - **Backend**: Node.js, Prisma ORM, PostgreSQL
   - **Package Manager**: pnpm
   - **Authentication**: JWT-based authentication
   - **Image Storage**: Cloudinary

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm
- PostgreSQL

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo-url/saveplate.git
   cd saveplate
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables: Create a `.env` file in the root directory and configure the following:

   ```env
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/saveplate
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
   ```

4. Initialize the database:

   ```bash
   pnpm prisma db push
   pnpm prisma db seed
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

6. Access the application: Open your browser and navigate to `http://localhost:3000`.

---

## Project Structure

```
├── prisma
│   ├── schema.prisma        # Prisma schema definition
│   └── seed.ts              # Database seeding script
├── src
│   ├── app
│   │   ├── api              # API routes (e.g., login, logout)
│   │   ├── customer-dashboard
│   │   ├── seller-dashboard
│   │   ├── layout.tsx       # Layout with sidebar
│   │   ├── middleware.ts    # Middleware for authentication
│   │   └── page.tsx         # Landing page
│   ├── components
│   │   ├── ui               # Reusable UI components
│   │   └── app-sidebar.tsx  # Sidebar component
│   └── styles
│       └── globals.css      # Global styles
└── README.md                # Project documentation
```

---

## API Endpoints

### Authentication

- **Login**:

  - Endpoint: `POST /api/login`
  - Request Body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "message": "Login successful",
      "user": {
        "id": 1,
        "username": "seller_user",
        "role": "seller"
      }
    }
    ```

- **Logout**:

  - Endpoint: `POST /api/logout`
  - Response:
    ```json
    {
      "message": "Logout successful"
    }
    ```

- **Validate Token**:

  - Endpoint: `POST /api/validate-token`
  - Request Body:
    ```json
    {
      "token": "string"
    }
    ```
  - Response:
    ```json
    {
      "role": "string"
    }
    ```

---

## Users for Testing

### Pre-created Users:

#### Customer:

- **Username**: `customer_user`
- **Password**: `customer`
- **Role**: `customer`
- **Location**: `Bukit Panjang`

#### Seller:

- **Username**: `seller_user`
- **Password**: `seller`
- **Role**: `seller`
- **Location**: `Yishun`

---

## Future Enhancements

1. **Advanced Analytics**:

   - Add more detailed reports for sellers.

2. **Notifications**:

   - Push notifications for new items or updates.

3. **Payment Integration**:

   - Integrate payment gateways for transactions.

4. **Mobile App**:

   - Develop a mobile-friendly version or native app.

---
