# 📘 Let's Collab - Development Instructions

> **Internal Development Guide** - Detailed instructions for building the collaborative whiteboard platform

**Last Updated:** October 27, 2025  
**Team:** Frontend (2) + Backend (2) | Lead: Sameer Pawar

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Database Schema](#database-schema)
4. [Backend Development Guide](#backend-development-guide)
5. [Frontend Development Guide](#frontend-development-guide)
6. [Integration Points](#integration-points)
7. [Feature Implementation Checklist](#feature-implementation-checklist)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Guide](#deployment-guide)

---

## 🎯 Project Overview

### What We're Building

Let's Collab is a real-time collaborative whiteboard platform similar to Miro or Figma, where multiple users can:
- Create and manage multiple whiteboards
- Draw, sketch, add shapes and text in real-time
- Collaborate with others simultaneously
- Share boards with different permission levels
- Auto-save and sync changes across all users

### Core Use Cases

1. **Team Brainstorming** - Remote teams working on ideas together
2. **Classroom Collaboration** - Teachers conducting interactive lessons
3. **Design Sessions** - Quick wireframing and prototyping
4. **Project Planning** - Visual project management boards

---

## 🏗️ Architecture & Tech Stack

### Frontend Stack
```
React 19 (UI Framework)
├── Vite (Build Tool)
├── React Router DOM (Routing)
├── Excalidraw (Whiteboard Canvas)
├── Zustand (State Management)
├── Socket.IO Client (Real-time)
├── Axios (HTTP Client)
├── CSS3 (Styling)
└── React Hot Toast (Notifications)
```

### Backend Stack
```
Node.js + Express.js
├── Prisma ORM (Database)
├── MySQL (Database)
├── Socket.IO (Real-time Server)
├── JWT (Authentication)
├── bcrypt (Password Hashing)
└── Firebase/Supabase (File Storage)
```

### Communication Flow
```
User → React App → Axios → Express API → Prisma → MySQL
         ↓                    ↓
    Socket.IO Client ← Socket.IO Server
```

---

## 🗄️ Database Schema

### Tables to Create

#### 1. **users**
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- name (String)
- avatar (String, URL)
- provider (Enum: 'local', 'google', 'github')
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### 2. **whiteboards**
```sql
- id (UUID, Primary Key)
- title (String)
- thumbnail (String, URL)
- content (JSON) // Excalidraw elements
- ownerId (UUID, Foreign Key → users.id)
- createdAt (DateTime)
- updatedAt (DateTime)
- lastAccessedAt (DateTime)
```

#### 3. **collaborators**
```sql
- id (UUID, Primary Key)
- whiteboardId (UUID, Foreign Key → whiteboards.id)
- userId (UUID, Foreign Key → users.id)
- role (Enum: 'viewer', 'editor', 'owner')
- invitedBy (UUID, Foreign Key → users.id)
- invitedAt (DateTime)
- acceptedAt (DateTime, Nullable)
```

#### 4. **whiteboard_history**
```sql
- id (UUID, Primary Key)
- whiteboardId (UUID, Foreign Key → whiteboards.id)
- content (JSON)
- userId (UUID, Foreign Key → users.id)
- createdAt (DateTime)
```

#### 5. **share_links**
```sql
- id (UUID, Primary Key)
- whiteboardId (UUID, Foreign Key → whiteboards.id)
- token (String, Unique)
- role (Enum: 'viewer', 'editor')
- expiresAt (DateTime, Nullable)
- createdBy (UUID, Foreign Key → users.id)
- createdAt (DateTime)
```

### Relationships
- User **has many** Whiteboards (as owner)
- User **has many** Collaborators (as member)
- Whiteboard **has many** Collaborators
- Whiteboard **has many** History entries

---

## 🔧 Backend Development Guide

### Phase 1: Setup & Authentication (Week 1)

#### Step 1: Initialize Backend
```bash
mkdir backend
cd backend
npm init -y
npm install express prisma @prisma/client bcrypt jsonwebtoken cors dotenv socket.io
npm install -D nodemon @types/node
```

#### Step 2: Setup Prisma
```bash
npx prisma init
# Edit schema.prisma with tables above
npx prisma generate
npx prisma migrate dev --name init
```

#### Step 3: Create Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Prisma client instance
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── whiteboardController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── whiteboardRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   └── whiteboardService.js
│   ├── sockets/
│   │   └── whiteboardSocket.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── validators.js
│   └── server.js
├── prisma/
│   └── schema.prisma
├── .env
└── package.json
```

#### Step 4: Implement Authentication

**authController.js** - Build these endpoints:
```javascript
POST /api/auth/register
- Validate email/password
- Hash password with bcrypt
- Create user in database
- Generate JWT token
- Return user + token

POST /api/auth/login
- Validate credentials
- Compare password hash
- Generate JWT token
- Return user + token

POST /api/auth/logout
- Invalidate token (if using refresh tokens)

GET /api/auth/me
- Verify JWT token
- Return current user data
```

**JWT Middleware** - Create auth middleware:
```javascript
- Extract token from Authorization header
- Verify token with jwt.verify()
- Attach user to req.user
- Handle expired/invalid tokens
```

### Phase 2: Whiteboard CRUD (Week 2)

#### Step 5: Whiteboard Endpoints

**whiteboardController.js** - Implement:
```javascript
GET /api/whiteboards
- Get all whiteboards for logged-in user
- Include owned + collaborated boards
- Return with thumbnails

POST /api/whiteboards
- Create new whiteboard
- Set current user as owner
- Initialize empty content
- Return whiteboard object

GET /api/whiteboards/:id
- Get single whiteboard
- Check user permissions
- Return whiteboard + collaborators

PUT /api/whiteboards/:id
- Update whiteboard (title, content)
- Check editor/owner permissions
- Save to database
- Emit socket event for real-time sync

DELETE /api/whiteboards/:id
- Check owner permission
- Delete whiteboard + collaborators
- Return success message
```

### Phase 3: Collaboration Features (Week 3)

#### Step 6: Collaboration Endpoints

```javascript
POST /api/whiteboards/:id/invite
- Validate email/userId
- Check owner/editor permission
- Create collaborator record
- Send invitation email (optional)
- Return collaborator data

DELETE /api/whiteboards/:id/collaborators/:userId
- Check owner permission
- Remove collaborator
- Notify via socket

PUT /api/whiteboards/:id/collaborators/:userId/role
- Update collaborator role
- Check owner permission
- Return updated collaborator

POST /api/whiteboards/:id/share-link
- Generate unique token
- Set expiration time
- Save share link
- Return shareable URL

GET /api/whiteboards/join/:token
- Validate token
- Check expiration
- Add user as collaborator
- Redirect to whiteboard
```

### Phase 4: Real-time with Socket.IO (Week 3-4)

#### Step 7: Socket Events

**Server-side events to implement:**

```javascript
// Connection
socket.on('connection', (socket) => {
  // Authenticate socket connection
  // Store socket.id with userId
});

// Join whiteboard room
socket.on('whiteboard:join', ({ whiteboardId }) => {
  // Verify user permission
  // Join socket room
  // Broadcast user joined event
  // Send current collaborators list
});

// Content updates
socket.on('whiteboard:update', ({ whiteboardId, elements, appState }) => {
  // Validate permission
  // Broadcast to all users in room
  // Save to database (debounced)
});

// Cursor position
socket.on('cursor:move', ({ whiteboardId, x, y }) => {
  // Broadcast cursor position to others
  // Include user name/color
});

// User presence
socket.on('user:typing', ({ whiteboardId }) => {
  // Broadcast typing indicator
});

// Disconnect
socket.on('disconnect', () => {
  // Broadcast user left event
  // Clean up user from active list
});
```

**Client-side events to listen for:**
```javascript
socket.on('whiteboard:updated', (data) => {
  // Update local state
});

socket.on('user:joined', (user) => {
  // Add user to collaborators list
});

socket.on('user:left', (userId) => {
  // Remove from collaborators list
});

socket.on('cursor:position', ({ userId, x, y }) => {
  // Update cursor overlay
});
```

### Phase 5: Additional Features (Week 4)

#### Step 8: History & Auto-save

```javascript
// Auto-save implementation
- Debounce whiteboard updates (5 seconds)
- Save to database in background
- Create history snapshot every X changes

GET /api/whiteboards/:id/history
- Return version history
- Limit to last 50 versions

POST /api/whiteboards/:id/restore
- Restore from history version
- Create new history entry
```

---

## 💻 Frontend Development Guide

### Phase 1: Setup & Routing (Week 1)

#### Step 1: Project Structure (Already Done ✅)
```
frontend/src/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── whiteboard/
│   ├── ui/
│   └── layout/
├── pages/
├── store/
├── lib/
├── hooks/
├── services/
└── utils/
```

#### Step 2: Authentication UI

**LoginPage.jsx** - Implement:
```javascript
- Email/password form
- Form validation
- API call to /api/auth/login
- Store token in localStorage
- Update Zustand auth store
- Redirect to dashboard
- Error handling with toast
```

**SignupPage.jsx** - Implement:
```javascript
- Registration form
- Password confirmation
- Email validation
- API call to /api/auth/register
- Auto-login after signup
- Redirect to dashboard
```

**ProtectedRoute Component:**
```javascript
- Check isAuthenticated from store
- Redirect to login if not authenticated
- Show loading state while checking
```

### Phase 2: Dashboard (Week 1-2)

#### Step 3: Dashboard Implementation

**DashboardPage.jsx** - Build:
```javascript
Features:
- Fetch user's whiteboards on mount
- Display in grid layout
- Show thumbnail previews
- Last edited timestamp
- Create new whiteboard button
- Search/filter functionality
- Delete whiteboard with confirmation
- Rename whiteboard (inline edit)

API Calls:
- GET /api/whiteboards (on mount)
- POST /api/whiteboards (create new)
- DELETE /api/whiteboards/:id
- PUT /api/whiteboards/:id (rename)
```

**WhiteboardCard Component:**
```javascript
Props:
- whiteboard (object)
- onDelete (function)
- onRename (function)
- onClick (function)

Features:
- Thumbnail display
- Title (editable)
- Last edited time
- Collaborators count
- Context menu (delete, rename, share)
```

### Phase 3: Whiteboard Editor (Week 2-3)

#### Step 4: Excalidraw Integration

**WhiteboardPage.jsx** - Implement:

```javascript
import { Excalidraw } from "@excalidraw/excalidraw";

Features to implement:

1. Load whiteboard data:
   - Fetch from API on mount
   - Load Excalidraw elements
   - Set initial state

2. Auto-save:
   - Debounce changes (3-5 seconds)
   - Save to backend
   - Show saving indicator

3. Real-time collaboration:
   - Initialize socket connection
   - Join whiteboard room
   - Listen for updates from others
   - Broadcast local changes
   - Handle conflicts

4. Toolbar:
   - Back button
   - Whiteboard title (editable)
   - Share button
   - Export options
   - Collaborators list

Example implementation:
```
```jsx
const WhiteboardPage = () => {
  const { id } = useParams();
  const [elements, setElements] = useState([]);
  const [appState, setAppState] = useState({});
  const socket = useSocket();

  useEffect(() => {
    // Load whiteboard
    loadWhiteboard(id);
    
    // Join socket room
    socket.emit('whiteboard:join', { whiteboardId: id });
    
    // Listen for updates
    socket.on('whiteboard:updated', handleRemoteUpdate);
    
    return () => {
      socket.emit('whiteboard:leave', { whiteboardId: id });
    };
  }, [id]);

  const handleChange = (elements, appState) => {
    setElements(elements);
    setAppState(appState);
    
    // Debounced save
    debouncedSave(elements, appState);
    
    // Emit to others
    socket.emit('whiteboard:update', {
      whiteboardId: id,
      elements,
      appState
    });
  };

  return (
    <div className="whiteboard-page">
      <Toolbar />
      <Excalidraw
        initialData={{ elements, appState }}
        onChange={handleChange}
      />
    </div>
  );
};
```

### Phase 4: Collaboration Features (Week 3)

#### Step 5: Invite & Share

**InviteModal Component:**
```javascript
Features:
- Email input field
- Role selector (viewer/editor)
- Send invitation
- Show current collaborators list
- Remove collaborators (if owner)
- Change collaborator roles

API Calls:
- POST /api/whiteboards/:id/invite
- DELETE /api/whiteboards/:id/collaborators/:userId
- PUT /api/whiteboards/:id/collaborators/:userId/role
```

**ShareLinkModal Component:**
```javascript
Features:
- Generate shareable link
- Copy to clipboard
- Set expiration time
- Choose permission level
- Show active links
- Revoke links

API Calls:
- POST /api/whiteboards/:id/share-link
- DELETE /api/whiteboards/:id/share-link/:id
```

#### Step 6: Real-time Cursors

**CursorOverlay Component:**
```javascript
Features:
- Show other users' cursors
- Display user name next to cursor
- Color-code each user
- Smooth cursor animation
- Hide inactive cursors (>5 seconds)

Socket events:
- Emit: cursor:move
- Listen: cursor:position
```

### Phase 5: Additional Features (Week 4)

#### Step 7: User Profile & Settings

**ProfilePage.jsx:**
```javascript
Features:
- Edit name
- Change password
- Upload avatar
- Delete account
- Logout

API Calls:
- GET /api/user/profile
- PUT /api/user/profile
- PUT /api/user/password
- DELETE /api/user/account
```

---

## 🔗 Integration Points

### API Contract Between Frontend & Backend

#### Authentication
```javascript
// Register
POST /api/auth/register
Request: { email, password, name }
Response: { user: {...}, token: "..." }

// Login
POST /api/auth/login
Request: { email, password }
Response: { user: {...}, token: "..." }

// Get Current User
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { user: {...} }
```

#### Whiteboards
```javascript
// List Whiteboards
GET /api/whiteboards
Response: [{ id, title, thumbnail, updatedAt, role }]

// Get Whiteboard
GET /api/whiteboards/:id
Response: { id, title, content, collaborators: [...] }

// Create Whiteboard
POST /api/whiteboards
Request: { title }
Response: { id, title, content, ownerId }

// Update Whiteboard
PUT /api/whiteboards/:id
Request: { title?, content? }
Response: { id, title, content, updatedAt }

// Delete Whiteboard
DELETE /api/whiteboards/:id
Response: { message: "Deleted successfully" }
```

#### Collaboration
```javascript
// Invite User
POST /api/whiteboards/:id/invite
Request: { email, role: "viewer"|"editor" }
Response: { collaborator: {...} }

// Remove Collaborator
DELETE /api/whiteboards/:id/collaborators/:userId
Response: { message: "Removed successfully" }

// Generate Share Link
POST /api/whiteboards/:id/share-link
Request: { role, expiresIn }
Response: { link: "...", token: "..." }
```

### Socket.IO Events

```javascript
// Client → Server
'whiteboard:join' - { whiteboardId }
'whiteboard:leave' - { whiteboardId }
'whiteboard:update' - { whiteboardId, elements, appState }
'cursor:move' - { whiteboardId, x, y }

// Server → Client
'whiteboard:updated' - { elements, appState, userId }
'user:joined' - { user, whiteboardId }
'user:left' - { userId, whiteboardId }
'cursor:position' - { userId, x, y, name }
'collaborators:list' - [{ userId, name, online }]
```

---

## ✅ Feature Implementation Checklist

### MVP (Minimum Viable Product) - 4 Weeks

#### Week 1: Foundation
- [ ] **Backend Setup**
  - [ ] Initialize Express server
  - [ ] Setup Prisma + MySQL
  - [ ] Create database schema
  - [ ] Implement user authentication
  - [ ] JWT middleware
  - [ ] Error handling

- [ ] **Frontend Setup** ✅ (Already Done)
  - [ ] React + Vite project
  - [ ] Routing setup
  - [ ] Auth store (Zustand)
  - [ ] API client configuration
  - [ ] Basic pages structure

- [ ] **Authentication**
  - [ ] Login page functionality
  - [ ] Signup page functionality
  - [ ] Protected routes
  - [ ] Token management
  - [ ] Logout functionality

#### Week 2: Core Features
- [ ] **Dashboard**
  - [ ] Fetch & display whiteboards
  - [ ] Create new whiteboard
  - [ ] Delete whiteboard
  - [ ] Rename whiteboard
  - [ ] Search functionality

- [ ] **Whiteboard CRUD API**
  - [ ] Create whiteboard endpoint
  - [ ] Get whiteboard endpoint
  - [ ] Update whiteboard endpoint
  - [ ] Delete whiteboard endpoint
  - [ ] List user whiteboards

#### Week 3: Real-time Collaboration
- [ ] **Socket.IO Setup**
  - [ ] Backend socket server
  - [ ] Frontend socket client
  - [ ] Room management
  - [ ] Authentication for sockets

- [ ] **Excalidraw Integration**
  - [ ] Basic whiteboard rendering
  - [ ] Save/load functionality
  - [ ] Auto-save implementation
  - [ ] Export functionality (PNG, SVG)

- [ ] **Real-time Sync**
  - [ ] Broadcast whiteboard changes
  - [ ] Receive & apply updates
  - [ ] Handle conflicts
  - [ ] Show active users

#### Week 4: Collaboration Features
- [ ] **Permissions System**
  - [ ] Owner, Editor, Viewer roles
  - [ ] Permission checks in API
  - [ ] UI based on permissions

- [ ] **Invite & Share**
  - [ ] Invite by email
  - [ ] Generate share links
  - [ ] Manage collaborators
  - [ ] Accept invitations

- [ ] **User Presence**
  - [ ] Show active collaborators
  - [ ] Real-time cursor positions
  - [ ] User join/leave notifications

### Post-MVP Features

#### Phase 2: Enhanced Features
- [ ] Whiteboard folders/organization
- [ ] Version history
- [ ] Undo/Redo across users
- [ ] Comments & annotations
- [ ] In-board chat

#### Phase 3: Advanced Features
- [ ] Video/voice calls
- [ ] Screen sharing
- [ ] Templates library
- [ ] AI features (shape recognition)
- [ ] Mobile app

---

## 🧪 Testing Strategy

### Backend Testing
```javascript
// Unit Tests (Jest)
- Auth service (register, login, JWT)
- Whiteboard service (CRUD operations)
- Permission checks
- Validators

// Integration Tests
- API endpoints
- Database operations
- Socket events

// Test Files
backend/tests/
├── unit/
│   ├── auth.test.js
│   └── whiteboard.test.js
├── integration/
│   ├── api.test.js
│   └── socket.test.js
└── setup.js
```

### Frontend Testing
```javascript
// Component Tests (React Testing Library)
- Login/Signup forms
- Dashboard components
- Whiteboard editor
- Modals and dialogs

// E2E Tests (Playwright)
- Complete user flows
- Collaboration scenarios
- Real-time sync

// Test Files
frontend/tests/
├── components/
├── pages/
└── e2e/
```

---

## 🚀 Deployment Guide

### Backend Deployment (Railway/Render)

```bash
1. Push code to GitHub
2. Connect Railway to repo
3. Set environment variables:
   - DATABASE_URL
   - JWT_SECRET
   - NODE_ENV=production
4. Deploy
```

### Frontend Deployment (Vercel)

```bash
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - VITE_API_URL=https://your-backend.railway.app
   - VITE_SOCKET_URL=https://your-backend.railway.app
4. Deploy
```

### Database (PlanetScale/Railway)

```bash
1. Create MySQL database
2. Run migrations:
   npx prisma migrate deploy
3. Copy connection string
4. Update DATABASE_URL
```

---

## 📞 Team Communication

### Daily Standup (15 min)
- What did you complete yesterday?
- What will you work on today?
- Any blockers?

### Weekly Review (Friday)
- Demo completed features
- Review code
- Plan next week
- Update this document

### Code Review Guidelines
- Review within 24 hours
- Check functionality
- Test locally
- Provide constructive feedback
- Approve or request changes

---

## 🎓 Learning Resources

### Backend
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.IO Guide](https://socket.io/docs/v4/)
- [JWT Best Practices](https://jwt.io/)

### Frontend
- [React Documentation](https://react.dev)
- [Excalidraw Documentation](https://docs.excalidraw.com)
- [Zustand Guide](https://docs.pmnd.rs/zustand)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)

---

## 🐛 Common Issues & Solutions

### Issue: CORS errors
**Solution:** Configure CORS in Express
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Issue: Socket connection fails
**Solution:** Check authentication and URL
```javascript
const socket = io(SOCKET_URL, {
  auth: { token: getToken() }
});
```

### Issue: State not syncing
**Solution:** Ensure proper socket room management

### Issue: Database connection errors
**Solution:** Check DATABASE_URL and Prisma client

---

## 📝 Notes & Best Practices

### Code Style
- Use ESLint/Prettier
- Consistent naming conventions
- Write comments for complex logic
- Keep functions small and focused

### Git Workflow
```bash
main (production)
├── develop (staging)
    ├── feature/authentication
    ├── feature/whiteboard-crud
    └── feature/real-time-sync
```

### Commit Messages
```
feat: add user authentication
fix: resolve whiteboard save issue
docs: update API documentation
refactor: improve socket event handling
test: add whiteboard controller tests
```

---

**Remember:** Communication is key! Don't hesitate to ask questions in the team chat. Happy coding! 🚀
