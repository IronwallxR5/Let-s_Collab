# Let's Collab 🎨

> A real-time collaborative whiteboard platform for teams, classrooms, and creative minds.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 📋 Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Advanced Features](#advanced-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**Let's Collab** is a real-time collaborative whiteboard platform where users can create, organize, and share multiple whiteboards. Each board supports live drawing, sticky notes, shapes, text, and media — all synced instantly for every collaborator.

### Use Cases

- 🧑‍💼 **Team Brainstorming** - Remote teams collaborating on ideas
- 🎓 **Classroom Collaboration** - Teachers and students working together
- 🎨 **UI Design Sketches** - Quick wireframing and design collaboration
- 📊 **Project Planning** - Visual project management and workflows
- 💡 **Creative Workshops** - Real-time creative sessions

## ✨ Core Features 

### 1. 🔐 User Accounts & Authentication

- Sign up / Login (Email, Google, GitHub)
- Password reset functionality
- User profile with avatar and display name
- Secure JWT-based authentication

### 2. 📊 Whiteboard Management

- Create multiple whiteboards
- Rename / Delete whiteboards
- Organize boards into folders (optional, later phase)
- Thumbnail previews of boards on dashboard
- Quick search and filter boards

### 3. 🤝 Collaboration

- **Invite Collaborators** via email or shareable link
- **Permission Levels:**
  - 👁️ Viewer (read-only access)
  - ✏️ Editor (can edit and draw)
  - 👑 Owner (full control)
- Real-time sync using Socket.IO
- Presence indicators showing active collaborators' cursors and names
- Live cursor tracking with user names

### 4. 🎨 Drawing Tools

- **Pen/Brush** with customizable color and thickness
- **Shapes**: Rectangle, Circle, Line, Arrow
- **Eraser** tool
- **Undo/Redo** functionality
- **Zoom in/out** and pan
- **Text boxes** with formatting options
- **Sticky notes** for quick annotations
- Color picker with preset palettes

### 5. 💾 Saving & Persistence

- Auto-save board content to the cloud
- Real-time data synchronization
- Version history (restore previous states)
- Conflict resolution for simultaneous edits


### 💾 Export & Integration

#### Export Options
- Export boards as PNG, PDF, or SVG
- Batch export multiple boards

#### Integrations
- **Cloud Storage**: Google Drive integration
- **Productivity**: Notion, Slack notifications
- **Video Conferencing**: Zoom, Microsoft Teams
- **Developer Tools**: GitHub for dev brainstorming
- **API Access**: RESTful API for custom integrations

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 
- **Canvas Library**: Fabric.js (for drawing and canvas manipulation)
- **State Management**: Zustand
- **Styling**: Tailwind CSS / Styled Components
- **Real-time**: Socket.IO Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Prisma ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)

### Infrastructure
- **File Storage**: Firebase/ supabase
- **Hosting**: Vercel (Frontend) + AWS/DigitalOcean (Backend)
- **Database Hosting**: PlanetScale / Railway / AWS RDS


## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** or **yarn** or **pnpm**
- **MySQL** (v8.x or higher)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/IronwallxR5/Let-s_Collab.git
cd Let-s_Collab
```

2. **Install dependencies**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**

Create `.env` files in both frontend and backend directories:



4. **Database Setup**

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npm run seed
```

5. **Run the application**

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```


## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

<div align="center">
  Made with ❤️ by the Let's Collab Team
  
  ⭐ Star us on GitHub — it helps!
</div>
