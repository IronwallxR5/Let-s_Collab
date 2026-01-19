const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./config/passport");
const route = require("./routes");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { initializeSocket } = require("./controllers/socket");
const { initRedis } = require("./config/redis");

const app = express();
const httpServer = createServer(app);
const PORT = 3000;

// Configure allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://let-s-collab.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

// Initialize Socket.IO with CORS and performance optimizations
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
  // Performance optimizations
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e7, // 10MB max message size
  transports: ['websocket', 'polling'], // Prefer websocket
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "50mb" })); // Increased limit for thumbnails
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Session middleware for passport
app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", route);

// Initialize Socket.IO handlers
initializeSocket(io);

// Initialize Redis cache
initRedis().then(() => {
  console.log('Redis initialization complete');
}).catch(err => {
  console.error('Redis initialization failed:', err.message);
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Socket.IO server running`);
});
