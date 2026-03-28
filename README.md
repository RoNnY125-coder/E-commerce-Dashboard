# 🛒 E-Commerce SaaS Dashboard

A professional, full-stack **E-Commerce Admin Dashboard** designed to visualize business performance, manage inventory, and track orders in real time. 
This project has been upgraded from a frontend prototype to a production-grade SaaS application with a dedicated Node.js/Express/PostgreSQL backend.

---

## ✨ Features

- 🔐 **Secure Authentication:** JWT-based auth with persistence and protected routes.
- 📊 **Real-time Analytics:** In-depth insights into revenue, sales, and customer growth.
- 📦 **Inventory Management:** Dynamic stock tracking with automated status indicators.
- 🧾 **Order Management:** Real-time order tracking and lifecycle management.
- 📈 **Interactive Reports:** High-performance charting using Recharts.
- 🎨 **Premium UI:** Finance-inspired design with smooth Framer Motion animations.
- 📱 **Fully Responsive:** Optimized for desktop, tablet, and mobile viewing.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **State Management:** Zustand, TanStack Query (React Query)
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL (with Docker support)
- **Cache:** Redis
- **Cloud Storage:** Cloudinary (for product images)

---

## 🎨 Design Philosophy

- **Vibrant & Premium:** Finance-inspired color palette (greens, neutrals, accent gold).
- **Enterprise Grade:** Minimalist, high-readability layout.
- **Micro-Interactions:** Subtle animations for a premium SaaS feel.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (for Database/Redis)

### 🛠️ Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Setup environment variables (`.env`):
   ```bash
   cp .env.example .env
   ```
3. Spin up infrastructure:
   ```bash
   docker-compose up -d
   ```
4. Run migrations and seed data:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 💻 Frontend Setup
1. From the root directory:
   ```bash
   npm install
   npm run dev
   ```

---

## 🔐 Deployment
The project is architected for decoupled deployment:
- **Frontend:** Vercel / Netlify
- **Backend:** Heroku / Render / Railway
- **Database:** Supabase PostgreSQL / Railway PostgreSQL
