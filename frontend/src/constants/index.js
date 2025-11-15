/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
};

/**
 * Application Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  WHITEBOARD: '/whiteboard/:id',
  AUTH_CALLBACK: '/auth/callback',
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  USER: 'user',
  THEME: 'themeMode',
  LAST_BOARD: 'lastBoardId',
};

/**
 * User Roles
 */
export const USER_ROLES = {
  VIEWER: 'VIEWER',
  EDITOR: 'EDITOR',
  OWNER: 'OWNER',
};

/**
 * Theme Modes
 */
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

/**
 * Toast Messages
 */
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  BOARD_CREATED: 'New whiteboard created!',
  BOARD_DELETED: 'Whiteboard deleted',
  INVITE_SENT: 'Invite sent successfully',
  INVITE_ACCEPTED: 'Invite accepted successfully',
  ERROR_GENERIC: 'Something went wrong',
  ERROR_AUTH: 'Authentication failed',
};
