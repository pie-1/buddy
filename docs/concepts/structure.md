college-buddy/
├── client/                 # Vite + React
│   ├── src/
│   │   ├── assets/         # Images, SVGs (like your logo)
│   │   ├── components/
│   │   │   ├── ui/         # Button, Card, Input, Loader
│   │   │   ├── layout/     # Navbar, Sidebar, PageWrapper
│   │   │   └── features/   # MarketplaceCard, ChatBox, etc.
│   │   ├── context/        # AuthContext (for JWT)
│   │   ├── hooks/          # useAuth, useFetch
│   │   ├── pages/          # Landing, Login, Dashboard, Marketplace
│   │   ├── utils/          # formatters, validators
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                 # Node + Express
    ├── config/             # db.js (MongoDB connection)
    ├── controllers/        # authController.js, listingController.js
    ├── middlewares/        # authMiddleware.js (JWT verification)
    ├── models/             # User.js, Listing.js, Conversation.js
    ├── routes/             # authRoutes.js, listingRoutes.js
    ├── utils/              # sendEmail.js, generateToken.js
    ├── .env                # Secrets (DO NOT COMMIT)
    └── server.js           # Entry point