# FreelanceFlow AI — Full-Stack SaaS Platform

**FreelanceFlow AI** is a production-grade full-stack SaaS platform built with **React 18**, **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. It empowers freelancers and boutique agencies to manage clients, track project progress, stream single-page PDF invoices directly in memory, export financial reports to Excel, and monitor business performance through real-time dynamic analytics.

---

## 🌐 Live Demo & Deployment

- **Frontend (Vercel):** [https://freelanceflow-ai.vercel.app](https://freelanceflow-ai.vercel.app)
- **Backend API (Render):** [https://freelanceflow-ai.onrender.com](https://freelanceflow-ai.onrender.com)
- **Database (Neon PostgreSQL):** Serverless PostgreSQL Cloud Engine

---

## 🌟 Key Features & Architecture

### 🏠 SaaS Landing Page (Home Page)
* **Modern Marketing Hero**: High-converting value proposition banner with glow effects.
* **Interactive Live Preview Tabs**: Switchable preview widgets for Dashboard, PDF Invoices, and Analytics.
* **Light / Dark Mode Switcher**: Real-time theme toggling persisted in `localStorage`.
* **Instant Demo Account Access**: 1-click guest login for recruiters and visitors.
* **Expandable FAQ Accordion**: Answers common questions on PDF streaming, security, and Excel exports.

### 🔒 Authentication & Multi-Tenant Security
* **Stateless JWT Authentication**: Bearer token headers for request authorization.
* **Row-Level Access Isolation (RLAC)**: Database queries strictly filter by `userId` to guarantee complete multi-tenant user data privacy.
* **Zod Input Schema Validation**: Sanitizes and validates request payloads before controller execution.
* **Production Security Middleware**: Integrated `helmet()` headers and `express-rate-limit` DDoS protection.

### 📄 Dynamic PDF Invoicing Engine
* **Zero-Disk In-Memory Streaming**: Pipes PDFKit buffers directly into HTTP response objects (`doc.pipe(res)`), eliminating disk I/O latency and file cleanup scripts.
* **Single-Page Bounds**: Dynamic margin calculations to prevent unwanted page 2 overflow spills.
* **Typography & Currency Fix**: Replaced unsupported Helvetica Unicode symbols with standard `INR` text formatting.

### 📊 Business Analytics & Excel Export
* **Real-Time Visualizations**: Interactive Recharts bar and pie charts plotting monthly revenue trends.
* **Executive Excel (.xlsx) Exports**: 1-click SheetJS workbook streaming for accounting.
* **Collection Efficiency**: Tracks paid vs. pending revenue ratios and overdue invoice alerts.

### 👥 Client & Project Management
* **Client Directory**: Manage contact records, company profiles, and client-specific revenue rankings.
* **Project Progress Sliders**: Interactive 0-100% completion sliders pre-synced with status badges.
* **Cascading Relational Deletes**: Configured Prisma `onDelete: Cascade` rules (`Client ➔ Project ➔ Invoice`).

### ⚡ Lightweight Real-Time Event Bus
* Custom browser events (`window.dispatchEvent`) synchronize profile avatar updates and global client header filtering instantly without full page reloads.

---

## 🖼️ Application Screenshots

### 🏠 Home Page (Landing Page)
<img width="100%" src="./screenshots/homepage.png" alt="Home Page Landing"/>

---

### 🔑 Login Page
<img width="100%" src="./screenshots/login.png" alt="Login Page"/>

---

### 📝 Register Page
<img width="100%" src="./screenshots/register.png" alt="Register Page"/>

---

### 📊 Dashboard
<img width="100%" src="./screenshots/dashboard.png" alt="Dashboard Overview"/>

---

### 👥 Clients Directory
<img width="100%" src="./screenshots/clients.png" alt="Clients Management"/>

---

### 👤 Client Details
<img width="100%" src="./screenshots/client-details.png" alt="Client Details"/>

---

### 📁 Projects Management
<img width="100%" src="./screenshots/projects.png" alt="Projects Management"/>

---

### 📂 Project Details
<img width="100%" src="./screenshots/project-details.png" alt="Project Details"/>

---

### 🧾 Invoices Management
<img width="100%" src="./screenshots/invoices.png" alt="Invoices Management"/>

---

### 📈 Reports & Analytics
<img width="100%" src="./screenshots/reports.png" alt="Reports & Analytics"/>

---

### 📋 Activity Audit Logs
<img width="100%" src="./screenshots/activity.png" alt="Activity Audit Logs"/>

---

### ⚙️ User Profile & Settings
<img width="100%" src="./screenshots/settings.png" alt="Profile Settings"/>

---

## 🛠️ Tech Stack & Dependencies

### Frontend
* **Core Library:** React 18 + Vite
* **Styling:** Tailwind CSS + Glassmorphism UI
* **Icons & UI:** Lucide React, React Hot Toast
* **Charts:** Recharts (`ResponsiveContainer`, `BarChart`, `PieChart`)
* **Exports:** SheetJS (`xlsx`)
* **State & Sync:** React Context API + Custom Browser Event Bus
* **Routing:** React Router DOM v6

### Backend
* **Runtime & Framework:** Node.js + Express.js
* **Database ORM:** Prisma ORM v5
* **Validation:** Zod Schema Validation
* **Security:** JWT (JSON Web Tokens), bcrypt.js, Helmet, Express Rate Limit
* **PDF Streaming:** PDFKit (HTTP Stream Piping)
* **Email Workflows:** Nodemailer + Resend API

### Database & Infrastructure
* **Database Engine:** PostgreSQL (Neon Serverless PostgreSQL Cloud)
* **Hosting:** Vercel (Frontend SPA) + Render (Node.js REST API)

---

## 🗄️ Database Relational Schema

```
┌──────────┐ 1        N ┌──────────┐ 1        N ┌───────────┐ 1        N ┌─────────┐
│   User   ├───────────►│  Client  ├───────────►│  Project  ├───────────►│ Invoice │
└────┬─────┘            └──────────┘            └───────────┘            └─────────┘
     │ 1
     │ N
┌────▼────────┐
│ ActivityLog │
└─────────────┘
```

* **User:** Multi-tenant account authentication, profile details (`hourlyRate`, `company`, `title`).
* **Client:** Name, email, company, budget tracking, user ownership foreign key.
* **Project:** Title, description, budget, progress (0-100%), deadline, client foreign key (`onDelete: Cascade`).
* **Invoice:** Invoice number, amount, status (`PAID` / `PENDING`), due date, project foreign key (`onDelete: Cascade`).
* **ActivityLog:** User action history details, entity type, timestamps.

---

## 🚀 Local Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/HRITIK200/FreelanceFlow-AI.git
cd FreelanceFlow-AI
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/freelanceflow?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
```

Apply database migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

Start backend development server:
```bash
npm run dev
```

### 3. Frontend Setup (`/client`)
```bash
cd ../client
npm install
```

Create a `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend development server:
```bash
npm run dev
```

---

## 💡 Key Technical Accomplishments

- **Zero-Disk PDFKit Streaming Engine:** Pipes PDF buffers directly to HTTP response stream (`doc.pipe(res)`), avoiding server disk I/O and cleanup scripts.
- **Row-Level Data Security:** All Prisma queries filter on `userId` to enforce strict multi-tenant isolation.
- **Lightweight Event Bus Sync:** Native `window.dispatchEvent` syncs profile avatar and global client filters without Redux boilerplate.
- **Defensive Error-Proof UI:** Component computations use `useMemo` with safe numeric fallbacks (`Number(val) || 0`) and `Array.isArray()` guards.

---

## 👨‍💻 Author

### **Hritik Pal**
* Full-Stack MERN / PERN Developer | MCA Graduate
* **GitHub:** [https://github.com/HRITIK200](https://github.com/HRITIK200)
* **LinkedIn:** [https://www.linkedin.com/in/hritik-pal-616005217/](https://www.linkedin.com/in/hritik-pal-616005217/)
* **Email:** [palhritik18@gmail.com](mailto:palhritik18@gmail.com)
