/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * User Roles
 */
const USER_ROLES = {
  VIEWER: "VIEWER",
  EDITOR: "EDITOR",
  OWNER: "OWNER",
};

/**
 * Invite Status
 */
const INVITE_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
};

/**
 * Cookie Options
 */
const getCookieOptions = () => {
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT;
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  INVITE_STATUS,
  getCookieOptions,
};
