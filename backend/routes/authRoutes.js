const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
  getUsers,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  validateRequest,
  registerUser,
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser,
);

// Refresh token: validate that a token exists in body (cookie is read server-side)
router.post("/refresh-token", refreshAccessToken);

// Logout: protect is attempted but controller handles both authed and cookie-only paths
router.post("/logout", logoutUser);

router.get("/me", protect, getMe);
router.get("/users", protect, admin, getUsers);

module.exports = router;
