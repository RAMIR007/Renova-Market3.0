# Renova Market 3.0

Renova Market is a modern e-commerce platform designed for the second-hand fashion market in Cuba. Built with the latest web technologies, it offers a premium user experience for buying and selling high-quality pre-owned clothing.

![Renova Market Banner](/public/icons/icon-512x512.png) 
*(Replace with actual screenshot if available)*

## 🚀 Key Features

### For Customers
*   **🛒 Frictionless Checkout**: 
    *   **Buy via WhatsApp**: Direct integration to finalize orders via chat with pre-filled details.
    *   **Lazy Registration**: Create an account *automatically* during checkout just by checking a box. No extra forms.
    *   **Guest Checkout**: Purchase without forced persistent account creation.
*   **📱 Social Commerce Experience**:
    *   **Stories**: Instagram-style stories on the homepage showcasing the latest arrivals.
    *   **Social Proof**: Real-time "View Counter" on products and "Sold/Reserved" badges to create urgency.
    *   **Scarcity Triggers**: "Only 1 unit left" visual cues.
*   **Browsing & Search**: Advanced client-side search, filtering by categories, price, and condition.
*   **Wishlist (Lista de Deseos)**: ❤️ Track favorite unique items.
*   **PWA Support**: Installable as a native-like app.

### For Administrators & Sellers
*   **📈 Dashboard & Analytics**: Manage products, orders, and gain insights.
*   **🤝 Referral System**: 
    *   **Seller Toolbar**: Persistent toolbar for sellers to copy their unique referral links.
    *   **Affiliate Tracking**: Automatic association of orders to sellers via link.
    *   **Dynamic WhatsApp**: Orders are routed to the specific seller's WhatsApp if referred.
*   **✍️ Content Management**: 
    *   **Rich Text Editor**: Markdown support with a custom toolbar (Bold, Italic, Lists, Emojis) for beautiful product descriptions.
    *   **Multi-Image Upload**: Drag & drop support via Cloudinary.
*   **Business Intelligence**: Track "Seller Profit" vs "Real Cost".
*   **Audit Log**: Complete history of changes.

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
