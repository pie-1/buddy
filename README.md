<div align="center">

# 🎓 CollegeBuddy

**The verified campus network for Nepali universities.**
Buy, sell, rent, find roommates, join events, build teams, and connect — all from one place.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Made with MERN](https://img.shields.io/badge/MERN-Stack-3c873a)](https://www.mongodb.com/mern-stack)

[Overview](#overview) · [Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Contributing](#contributing) · [Roadmap](#roadmap)

</div>

---

## Overview

CollegeBuddy is an open-source, university-verified social platform built for students across Nepal. Every account is tied to a real `.edu.np` email domain — no fake profiles, no anonymous scammers, just your campus community.

The project is a **MERN stack application** (MongoDB, Express, React, Node.js) built to be:
- **Verified** — only students with valid college emails can join
- **Contextual** — every chat is tied to a listing, event, project, or roommate post
- **Reputation-first** — trust scores reward real participation
- **Open source** — built in public, maintained by students, for students

---

## Features

### 🛒 Marketplace
- Buy, sell, or rent items within your campus
- Photo + PDF attachments per listing
- In-context chat with the seller
- Owner-managed listing status (Available / Sold / Rented / Hidden)
- Trust score awarded on successful sale

### 🏠 Roommates
- Post and browse room listings with map pins
- Filter by area, budget, gender preference, move-in date
- Chat directly with the lister

### 🎉 Events & Team Formation
- Discover events filtered by department and college
- RSVP with "Interested" / "Going"
- Post team requests per event to find collaborators
- Get reminders 24h before

### 🤝 Campus Directory
- Browse verified students by name, department, skills
- Public profile with Buddy Pass card
- Like and message anyone in the directory
- "Why you should connect" suggestions based on shared traits

### 💬 Unified Chat
- One inbox for all conversations
- Every thread carries context: `listing:123`, `event:456`, `profile:789`
- Text, images, and contextual previews
- Report and block from any thread

### ⭐ Spotlight
- Weekly top-3 profile promotion
- Paid placement via eSewa (Rs. 100/week)
- Admin-verified payment proofs
- Automatic fallback to high-activity students when slots are unfilled

### 📊 Trust Score System
Every real action earns you trust:
| Action | Points |
|---|---|
| Email verified | +5 |
| Profile completed | +10 |
| Listing sold | +5 |
| Event attended | +3 |
| Answer accepted | +8 |
| Spotlight verified | +10 |
| Admin verification | +2 |
| Admin claim review | +1 |

Trust tiers: **Newcomer** (0-19) → **Trusted** (20-49) → **Respected** (50-99) → **Elite** (100+)

### 🛡️ Admin Dashboard
- Domain verification queue
- Spotlight payment approvals
- User management (roles: student / moderator / admin)
- Moderation reports and disputes
- Platform analytics

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS + Framer Motion |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Real-time** | Socket.io |
| **File Storage** | Cloudinary |
| **Email** | Nodemailer (Gmail SMTP) |
| **Auth** | JWT + OTP email verification |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Git**
- A **MongoDB Atlas** account (free tier works)
- A **Cloudinary** account (free tier works)
- A **Gmail** account with [App Password](https://support.google.com/accounts/answer/185833) enabled

### 1. Clone the repository

```bash
git clone https://github.com/pie-1/buddy.git
cd buddy
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Set up environment variables

**Backend** — create `server/.env`:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database (MongoDB Atlas)
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/buddy?retryWrites=true&w=majority

# Auth
JWT_SECRET=your_long_random_secret
ADMIN_INVITE_CODE=your_admin_invite_code

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Frontend** — create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

> 💡 **Backend `.env.example`** and **frontend `.env.example`** are committed to the repo. Copy them:
> ```bash
> cp server/.env.example server/.env
> cp client/.env.example client/.env
> ```

### 4. Run the app

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

You should see:
- Backend: `MongoDB Connected: ac-xxx-shard-00-01.mongodb.net`
- Frontend: the CollegeBuddy landing page

### 5. Register a test account

1. Click **Get started**
2. Use a valid `.edu.np` email (e.g. `test@acme.edu.np`)
3. Check your Gmail inbox for the OTP (also logged to the backend terminal in dev)
4. Enter the OTP → verify → you're in

### 6. Create an admin account (optional)

Register with a different email, then in `server/.env` set `ADMIN_INVITE_CODE` and use it during signup with role `admin`.

---

## Project Structure

```
buddy/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI + feature components
│   │   │   ├── features/      # Feature-scoped components
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   └── ui/            # Generic primitives
│   │   ├── constants/         # Shared constants (categories, statuses)
│   │   ├── context/           # AuthContext, SocketContext
│   │   ├── pages/             # Route-level pages
│   │   ├── services/          # API client wrappers
│   │   └── utils/             # Helper functions
│   ├── Dockerfile
│   └── nginx.conf
├── server/                    # Express backend
│   ├── config/                # DB + Cloudinary config
│   ├── controllers/           # Route handlers
│   ├── middlewares/           # Auth, validation
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routers
│   ├── sockets/               # Socket.io handlers
│   ├── utils/                 # Shared helpers (trustScore, email, etc.)
│   └── Dockerfile
└── docker-compose.yml
```

---

## Contributing

We welcome contributions from students and developers of all skill levels.

### How to contribute

1. **Fork** the repository
2. **Create a branch** for your change:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** — follow the existing code style
4. **Test locally** — make sure `npm run dev` works on both client and server
5. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add roommate filter by move-in date"
   ```
6. **Push** and open a **Pull Request**

### Commit message convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     new feature
fix:      bug fix
docs:     documentation only
style:    formatting, no code change
refactor: code change that doesn't add/fix anything
test:     adding tests
chore:    maintenance
```

### What to work on

- Check the [Issues](https://github.com/pie-1/buddy/issues) tab — look for `good first issue` labels
- Read feature docs in `docs/features/` before starting
- Comment on the issue to claim it before opening a PR

### Code style

- **Frontend**: 2 spaces, functional components, hooks over classes
- **Backend**: 2 spaces, `async/await` over callbacks, controllers return JSON
- **Comments**: explain *why*, not *what*
- **Names**: `PascalCase` for components, `camelCase` for functions/variables, `UPPER_SNAKE` for constants

### Never commit

- `.env` files (only `.env.example`)
- `node_modules/`
- `dist/` or `build/`
- Editor-specific files (`.vscode/`, `.idea/`) unless explicitly needed

---

## Roadmap

- [x] Auth with `.edu.np` email verification
- [x] Marketplace with buy/sell/rent
- [x] Roommates with map-based listings
- [x] Events with RSVP and team formation
- [x] Campus directory with trust scores
- [x] Unified chat with context
- [x] Spotlight with admin verification
- [x] Admin dashboard
- [ ] Docker + one-command local setup
- [ ] Automated tests (Jest + React Testing Library)
- [ ] Mobile app (React Native)
- [ ] Escrow payments for marketplace
- [ ] Public API for third-party integrations

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## Maintainers

- **Pawan Singh** ([@pie-1](https://github.com/pie-1))

---

<div align="center">

**Built with ❤️ by students, for students.**

If this project helped you, give it a ⭐ on GitHub — it means a lot.

</div>