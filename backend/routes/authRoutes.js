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
      .withMessage("Password must be at least 6 characters"),
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

router.post("/refresh-token", refreshAccessToken);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);
router.get("/users", protect, admin, getUsers);

module.exports = router;
