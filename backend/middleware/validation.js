/**
 * Validate request body fields
 */
const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
};

/**
 * Validate email format
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
  }

  next();
};

/**
 * Validate password strength
 */
const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }
  }

  next();
};

module.exports = {
  validateFields,
  validateEmail,
  validatePassword,
};
