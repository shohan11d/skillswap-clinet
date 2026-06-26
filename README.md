# SkillSwap - Freelance Micro-Task Platform

SkillSwap is a full-stack freelance marketplace where **Clients** can post micro-tasks and **Freelancers** can browse tasks, submit proposals, complete projects, and receive payments securely. The platform also includes an **Admin Dashboard** for managing users, tasks, and transactions.

## 🌐 Live Demo

**Live Website:** https://taskhive-eight-phi.vercel.app/

## 📌 Project Purpose

SkillSwap simplifies the process of hiring freelancers for small online tasks. Clients can publish jobs, review proposals, hire freelancers, and make secure payments through Stripe. Freelancers can discover opportunities, submit proposals, manage active projects, and track their earnings—all from a modern dashboard.

---

## ✨ Key Features

### Authentication & Authorization

* Better Auth authentication
* Email & Password login
* Google OAuth login
* Role-based authentication (Client, Freelancer, Admin)
* Protected dashboard routes
* Blocked users cannot log in

### Client Features

* Post new tasks
* Edit/Delete open tasks
* Manage freelancer proposals
* Accept or reject proposals
* Stripe payment integration
* Track task progress

### Freelancer Features

* Browse available tasks
* Search and filter tasks
* Submit one proposal per task
* Track proposal status
* Manage active projects
* Submit project deliverables
* View earnings
* Edit public profile

### Admin Features

* Dashboard analytics
* Manage users
* Block/Unblock accounts
* Manage tasks
* View payment history
* Monitor platform activity

### Payment System

* Stripe Checkout integration
* Secure payment verification
* Payment success page
* Transaction history

### Additional Features

* Responsive design
* Modern dashboard UI
* Search functionality
* Category filtering
* Server-side pagination
* Role-based navigation
* Custom 404 page
* Protected API routes

---

# 🛠️ Tech Stack

### Frontend

* Next.js 15
* React
* Tailwind CSS
* shadcn/ui
* TypeScript
* React Hook Form
* TanStack Query
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Better Auth
* Stripe
* JWT
* CORS
* dotenv

---

# 📂 Database Collections

### Users

* name
* email
* image
* role
* skills
* bio
* isBlocked
* createdAt

### Tasks

* title
* category
* description
* budget
* deadline
* client_email
* status
* deliverable_url
* createdAt

### Proposals

* task_id
* freelancer_email
* proposed_budget
* estimated_days
* cover_note
* status
* submitted_at

### Payments

* client_email
* freelancer_email
* task_id
* amount
* transaction_id
* payment_status
* paid_at

### Reviews

* task_id
* reviewer_email
* reviewee_email
* rating
* comment
* created_at

---

# 🚀 Installation

Clone the repositories.

```bash
git clone https://github.com/your-username/skillswap-client.git
git clone https://github.com/your-username/skillswap-server.git
```

Install dependencies.

```bash
npm install
```

Create environment files.

Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_PUBLISHABLE_KEY=
```

Backend (`.env`)

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Run the development servers.

```bash
npm run dev
```

---

# 👥 Test Credentials

## Admin

**Email**

```
admin1@taskhive.com
```

**Password**

```
admin1@taskhive.com
```

## Freelancer

**Email**

```
freelanceruser3@gmail.com
```

**Password**

```
freelanceruser3@gmail.com
```

---

# 📁 Project Structure

```
client/
├── app/
├── components/
├── hooks/
├── providers/
├── lib/
└── public/

server/
├── routes/
├── middleware/
├── controllers/
├── database/
└── index.js
```

---

# 📦 NPM Packages

### Frontend

* next
* react
* tailwindcss
* shadcn/ui
* better-auth
* @tanstack/react-query
* react-hook-form
* axios
* zod
* lucide-react
* sonner

### Backend

* express
* mongodb
* better-auth
* stripe
* jsonwebtoken
* cors
* dotenv
* cookie-parser

---

# 🔐 Security

* Environment variables for all secret keys
* Better Auth authentication
* JWT authorization
* HTTP-only cookies
* Protected API routes
* Role-based access control
* Blocked user protection
* Secure Stripe payment verification

---

# 📱 Responsive Design

The application is fully responsive and optimized for:

* Desktop
* Laptop
* Tablet
* Mobile

---

# 🔗 Links

**Live Site**

https://taskhive-eight-phi.vercel.app/

**Client Repository**

https://github.com/your-username/skillswap-client

**Server Repository**

https://github.com/your-username/skillswap-server

---

## Developed By

**Mohammad Shohan**

Frontend Developer | React | Next.js | TypeScript
