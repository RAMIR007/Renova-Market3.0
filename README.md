# Renova Market 3.0

Renova Market is a modern e-commerce platform designed for the second-hand fashion market in Cuba. Built with the latest web technologies, it offers a premium user experience for buying and selling high-quality pre-owned clothing.

![Renova Market Banner](/public/icons/icon-512x512.png) 
*(Replace with actual screenshot if available)*

## 🚀 Key Features

### For Customers
*   **Browsing & Search**: Advanced client-side search, filtering by categories, price, and condition.
*   **Product Reservation System**: 
    *   **15-Minute Lock**: Products are reserved for 15 minutes as soon as checkout begins to prevent race conditions.
    *   **Anti-Abuse**: System temporarily bans users who repeatedly fail to complete reserved orders.
*   **Wishlist (Lista de Deseos)**: ❤️ Users can save their favorite unique items to track them.
*   **Social & Sharing**: 
    *   **WhatsApp Integration**: "Send Order via WhatsApp" button for immediate confirmation and contact.
    *   **Native Share**: Easily share product finds with friends via native device dialogs.
*   **Smart Recommendations**: "Complete the Look" section showing related products.
*   **PWA Support**: Installable as a native-like app on mobile and desktop.
*   **User Accounts**: Secure registration and login.

### For Administrators & Sellers
*   **Comprehensive Dashboard**: Manage products, orders, and users.
*   **Audit Log & History**: 🕒 Complete tracking of who changed what and when (Product Creations, Updates, Deletions) in `/admin/history`.
*   **Advanced Product Management**: 
    *   Upload multiple images per product.
    *   **Image Editor**: Built-in tool to rotate images 90° directly in the browser.
    *   Detailed fields: Brand, Model, Size, Color, Condition, and Cost analysis.
*   **Category Management**: Create and organize product categories dynamically.
*   **Business Intelligence**: Track "Seller Profit" vs "Real Cost".

## 🛠 Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Image Storage**: [Cloudinary](https://cloudinary.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL Database
*   Cloudinary Account

### 1. Clone the repository
```bash
git clone https://github.com/RAMIR007/Renova-Market3.0.git
cd Renova-Market3.0
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure the following:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="renova_preset"

# Authentication (Session Security, etc.)
SESSION_SECRET="your-secure-session-secret"
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🔐 Admin Access
To access the admin panel, navigate to `/admin/login`.
(Note: Initial admin setup may require direct database seeding or using the hardcoded fallback if enabled in development).

## 📱 PWA Features
This application is a Progressive Web App. Users will be prompted to "Install App" on supported browsers, allowing for:
*   Home screen access.
*   Fullscreen experience.
*   Offline capabilities (cached assets).

## 📄 License
Private Property of Renova Market.
