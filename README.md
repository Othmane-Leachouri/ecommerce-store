# ÉLORA PARFUMS

**Luxury Fragrances. Timeless Elegance.**

ÉLORA PARFUMS is a modern and elegant perfume e-commerce website designed to provide a simple and smooth online shopping experience.

Customers can explore fragrances, add products to their shopping cart, manage quantities, and place orders directly through WhatsApp. The application uses Supabase to store products and orders securely.
<img width="755" height="440" alt="image" src="https://github.com/user-attachments/assets/cb5c2a12-5298-44d0-9473-5b4b255e5ad7" />

##  Features

- Browse available perfumes.
- Add products to the shopping cart.
- Update product quantities.
- Remove products from the cart.
- Calculate the total price automatically.
- Save cart items using Local Storage.
- Retrieve products dynamically from Supabase.
- Store customer orders in a database.
- Calculate order totals securely on the server.
- Generate WhatsApp order messages.
- Responsive design for mobile and desktop.
- Admin Dashboard

## Admin Dashboard
The application includes an Admin Dashboard to manage and monitor the store.
View sales statistics and key business metrics.
Monitor and manage customer orders.
Track order statuses.
View customer information and purchase history.
Manage store products and their availability.


<img width="948" height="439" alt="image" src="https://github.com/user-attachments/assets/75c062f7-d9b1-46c2-b735-a96a7d0580c9" />


##  Future Improvements

- [ ] Integrate an **AI Shopping Assistant** to provide smart product recommendations and improve the shopping experience.

##  Technologies

- React
- TypeScript
- Vite
- CSS
- React Router
- Lucide React
- Local Storage
- Supabase Database
- Supabase Edge Functions
- WhatsApp

##  Database Architecture

The application uses Supabase PostgreSQL with three main tables:

| Table | Description |
|---|---|
| `products` | Stores perfume information, prices and availability. |
| `orders` | Stores customer information, order totals and statuses. |
| `order_items` | Stores the products and quantities associated with each order. |

##  Security

Security is handled using Supabase Row Level Security (RLS) and Edge Functions.

- RLS is enabled on all database tables.
- Public users can only read active products.
- Direct public insertion into orders and order items is not allowed.
- Orders are created through a Supabase Edge Function.
- Product prices are retrieved directly from the database.
- Order totals are calculated server-side instead of trusting frontend prices.
- Supabase secret keys are kept server-side and are never exposed in frontend code.
- Customer order data is protected from direct public database access.

##  Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd ecommerce-store
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Build for production

```bash
npm run build
```

## ⚙️ Store Configuration

Store information can be customized in:

`src/data/store.ts`

- Store name
- Logo
- WhatsApp number
- Currency

Products are managed through the
