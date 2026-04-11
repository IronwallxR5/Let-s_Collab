# Let's Collab 🎨

> A real-time collaborative whiteboard platform for teams, classrooms, and creative minds.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## 🎯 What is Let's Collab?

**Let's Collab** is a real-time collaborative whiteboard platform where users can create, organize, and share multiple whiteboards. Each board supports live drawing, sticky notes, shapes, text, and media — all synced instantly for every collaborator.

Perfect for remote teams, classrooms, designers, and anyone who needs a shared visual workspace.

## ✨ Key Features

### 🔐 Authentication & User Management
- Email/password and OAuth (Google) authentication
- JWT-based secure sessions with HTTP-only cookies
- Inline profile editing (name, username, email)

### 📊 Whiteboard Management
- Create unlimited whiteboards
- Rename, delete, and organize boards
- Dashboard with board previews and thumbnails
- Search and sort (by name, created date, last updated)

### 🤝 Real-time Collaboration
- **Live sync** across all collaborators using Socket.IO
- **Permission levels**: Viewer, Editor, Owner
- **Invite collaborators** by username or email with role selection
- **Live cursors** showing collaborator positions and names
- **Presence indicators** for active users

### 🎨 Drawing & Design Tools
- Full-featured drawing powered by Excalidraw
- Shapes, lines, arrows, text, and sticky notes
- Color picker with custom palettes
- Undo/redo support
- Zoom and pan controls
- Export to PNG and SVG (via Excalidraw's built-in export)

### 💾 Data Persistence
- Auto-save on every Excalidraw change event
- Real-time synchronization via WebSockets
- Persistent storage with **PostgreSQL** via Prisma ORM
- Optional Redis caching for faster board and user lookups

## 🛠️ Tech Stack

### Frontend
- **React** (v19) with **Vite** — Fast, modern development
- **Excalidraw** — Professional whiteboard canvas
- **Zustand** — Lightweight state management
- **TailwindCSS** — Utility-first styling
- **Socket.IO Client** — Real-time communication
- **react-hot-toast** — Notifications

### Backend
- **Node.js** with **Express.js** (v5) — RESTful API
- **PostgreSQL** with **Prisma ORM** — Type-safe database access
- **Socket.IO** — WebSocket-based real-time sync
- **Passport.js** — Google OAuth 2.0 strategy
- **JWT** — Secure token-based auth
- **Redis** *(optional)* — In-memory caching for faster API responses

### Infrastructure
- **Vercel** — Frontend hosting
- **Render** — Backend and database hosting

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# Clone the repository
git clone https://github.com/IronwallxR5/Let-s_Collab.git
cd Let-s_Collab

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables (see SETUP.md)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run database migrations
cd backend
npx prisma migrate dev

# Start the application
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

**For detailed setup instructions, see [SETUP.md](SETUP.md)**

## 📸 Screenshots

### Dashboard
Manage all your whiteboards in one place with an intuitive interface.

### Whiteboard Editor
Collaborate in real-time with a full suite of drawing tools.

### Collaboration
See live cursors and invite team members with different permission levels.

## 📁 Project Structure

```
Let-s_Collab/
├── backend/              # Node.js + Express API
│   ├── config/          # Passport, Redis, and server configuration
│   ├── controllers/     # Route handlers (auth, boards, collaborators, invites, socket, users)
│   ├── middleware/      # Auth, cache, and validation middleware
│   ├── prisma/          # Database schema & migrations (PostgreSQL)
│   ├── routes/          # API route definitions
│   └── utils/           # Shared helper utilities
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── components/  # Reusable UI components (ShareScreen, InviteBox, ProfileDropdown, etc.)
│   │   ├── constants/   # App-wide constants (routes, roles, storage keys)
│   │   ├── contexts/    # Theme context
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions (cn, date formatting, etc.)
│   │   ├── pages/       # Route pages (Home, Login, Dashboard, Whiteboard, AuthCallback)
│   │   ├── services/    # API service layer (whiteboardService, inviteService)
│   │   └── store/       # Zustand state (authStore)
│   └── public/          # Static assets
├── SETUP.md             # Setup instructions
├── CONTRIBUTING.md      # Contribution guidelines
└── README.md            # This file
```

## 🗄️ Database Schema

The app uses **PostgreSQL** managed via Prisma ORM. Key models:

- **User** — Authentication, profile, Google OAuth linking
- **Board** — Whiteboard title, thumbnail, Excalidraw elements (JSON), owner
- **BoardCollaborator** — M:M join table with role (`VIEWER` | `EDITOR`)
- **Invite** — Pending/accepted/declined invitations linked to boards

Run migrations with:

```bash
cd backend
npx prisma migrate dev       # development
npx prisma migrate deploy    # production
```

## 🔌 API Overview

| Resource | Endpoint | Description |
|----------|----------|-------------|
| Auth | `POST /auth/register` | Register with email/password |
| Auth | `POST /auth/login` | Login and receive JWT cookie |
| Auth | `GET /auth/google` | Initiate Google OAuth flow |
| Users | `GET /users/me` | Get current authenticated user |
| Users | `PATCH /users/me` | Update profile (name, username, email) |
| Boards | `GET /boards` | List all boards for a user |
| Boards | `POST /boards` | Create a new board |
| Boards | `GET /boards/:id` | Get a single board |
| Boards | `PATCH /boards/:id` | Update board (title, thumbnail, elements) |
| Boards | `DELETE /boards/:id` | Delete a board (owner only) |
| Collaborators | `GET /collaborators/board/:boardId` | List collaborators |
| Collaborators | `POST /collaborators/board/:boardId` | Add collaborator by email |
| Collaborators | `DELETE /collaborators/:collaboratorId` | Remove collaborator |
| Collaborators | `PATCH /collaborators/:collaboratorId` | Update collaborator role |
| Invites | `POST /invites/board/:boardId` | Send invite (by email or username) |
| Invites | `GET /invites/pending` | Get pending invites for current user |
| Invites | `PATCH /invites/:id/accept` | Accept an invite |
| Invites | `PATCH /invites/:id/decline` | Decline an invite |
| Invites | `DELETE /invites/:id` | Cancel an invite (owner only) |

## 🤝 Contributing

We love contributions! Whether it's bug reports, feature requests, or code contributions, we welcome them all.

**See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.**

Quick contribution steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Excalidraw](https://excalidraw.com/) - Amazing whiteboard library
- [Socket.IO](https://socket.io/) - Real-time engine
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- All our [contributors](https://github.com/IronwallxR5/Let-s_Collab/graphs/contributors)

---

<div align="center">
  <p>Made with ❤️ by the Let's Collab Team</p>
  <p>⭐ Star us on GitHub — it helps!</p>
  
  [Website](https://let-s-collab.vercel.app) • [Report Bug](https://github.com/IronwallxR5/Let-s_Collab/issues) • [Request Feature](https://github.com/IronwallxR5/Let-s_Collab/issues)
</div>
