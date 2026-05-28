# CodeSense AI 🧠⚡

> AI-powered code reviewer built with React, Node/Express, MongoDB & Google Gemini

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ Features

### Phase 1
| Feature | Description |
|---------|-------------|
| 📋 Code Paste Area | Large textarea to paste any code |
| 🔍 Language Auto-Detect | Gemini automatically detects the programming language |
| 🐛 Bug Detection | Finds all bugs and logical errors |
| 💡 Fix Suggestions | Shows corrected, improved version of your code |
| 📊 Quality Score | 0–100 rating with animated visual ring |
| ↔ Before / After | Side-by-side original vs fixed code view |
| 📋 Copy Fixed Code | One-click copy button on the fixed code block |
| 🧒 ELI5 Mode | Beginner-friendly explanation of what the code does |
| 🔒 Security Check | Detects security vulnerabilities (XSS, injection, hardcoded secrets, etc.) |
| 🌓 Dark / Light Theme | VS Code-style dark theme by default with toggle |

### Phase 2
| Feature | Description |
|---------|-------------|
| 📁 File Upload | Upload `.js .py .java .cpp .ts .html .css` and more |
| 📋 Review History | All reviews saved to MongoDB with full detail view |
| 🔗 Share Links | Generate shareable links for any review |
| ↔ Compare Files | Upload and compare 2 code files side-by-side |

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, CSS3 (no UI library) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI | Google Gemini API (`gemini-1.5-flash`) |
| File Upload | Multer (memory storage) |
| Rate Limiting | express-rate-limit |
| Fonts | JetBrains Mono + Inter (Google Fonts) |

---

## 📁 Folder Structure

```
codesense-ai/
├── backend/
│   ├── controllers/
│   │   ├── aiService.js          # Gemini API integration
│   │   ├── authController.js     # User authentication logic
│   │   ├── compareController.js  # File comparison logic
│   │   ├── historyController.js  # History CRUD
│   │   ├── otpController.js      # OTP verification logic
│   │   ├── reviewController.js   # Review endpoints logic
│   │   └── shareController.js    # Share link generation
│   ├── middleware/
│   │   ├── authMiddleware.js     # User authentication middleware
│   │   ├── errorHandler.js       # Global error handler
│   │   └── upload.js             # Multer file upload config
│   ├── models/
│   │   ├── Review.js             # Mongoose Review schema
│   │   └── User.js               # Mongoose User schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── compareRoutes.js
│   │   ├── historyRoutes.js
│   │   ├── otpRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── shareRoutes.js
│   ├── .env                      # Your secrets (not committed)
│   ├── .env.example              # Template
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeBlock.jsx + .css
│   │   │   ├── DiffView.jsx + .css
│   │   │   ├── FileUpload.jsx + .css
│   │   │   ├── IssueList.jsx + .css
│   │   │   ├── LoadingOverlay.jsx + .css
│   │   │   ├── Navbar.jsx + .css
│   │   │   ├── ScoreCard.jsx + .css
│   │   │   └── Toast.jsx + .css
│   │   ├── pages/
│   │   │   ├── AuthPage.css
│   │   │   ├── ComparePage.jsx + .css
│   │   │   ├── HistoryPage.jsx + .css
│   │   │   ├── LandingPage.jsx + .css
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ReviewPage.jsx + .css
│   │   │   ├── SharedReviewPage.jsx + .css
│   │   │   └── SignupPage.jsx
│   │   ├── services/
│   │   │   ├── api.js            # All backend API calls
│   │   │   └── ToastContext.js   # Global toast context
│   │   ├── styles/
│   │   │   └── globals.css       # CSS variables + base styles
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key — free at [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

### 1. Clone the repo

```bash
git clone https://github.com/yourname/codesense-ai.git
cd codesense-ai
```

---

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/codesense-ai
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:5000
```

Start the backend:
```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

Backend runs on → `http://localhost:5000`  
Health check → `http://localhost:5000/health`

---

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm start
```

Frontend runs on → `http://localhost:3000`

---

## 🌐 API Endpoints

### Authentication & OTP Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/me` | Get current logged-in user profile (requires Auth header) |
| `POST` | `/api/otp/send` | Send OTP to email |
| `POST` | `/api/otp/verify` | Verify OTP |

### Code Review & Compare Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/review` | Review pasted code |
| `POST` | `/api/review/upload` | Review uploaded file |
| `GET` | `/api/history?page=1&limit=10` | Get paginated history |
| `GET` | `/api/history/:id` | Get single review |
| `DELETE` | `/api/history/:id` | Delete a review |
| `DELETE` | `/api/history` | Clear all history |
| `POST` | `/api/share/:reviewId` | Generate share link |
| `GET` | `/api/share/:shareId` | Get review by share ID |
| `POST` | `/api/compare` | Compare two code snippets/files |
| `GET` | `/health` | Health check |

---

## 🚢 Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add all environment variables from `.env.example`
5. Deploy

### Frontend → Vercel

1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` = your Render backend URL (e.g. `https://codesense-ai.onrender.com`)
4. Deploy

---

## 🔑 Notes

- **MongoDB is optional** for Phase 1 — the AI review works without it. History and share links require MongoDB.
- **Rate limiting:** 20 AI review requests per 15 minutes per IP.
- **File size limit:** 5MB per file upload.
- **Max code length:** 50,000 characters for paste, 30,000 characters per file for comparison.

---

## 📄 License

MIT — free to use, modify, and distribute.
