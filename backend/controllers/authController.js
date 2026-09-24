const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateAccessToken = (id) => {
  return jwt.sign({ id }, accessTokenSecret, { expiresIn: "15m" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, refreshTokenSecret, { expiresIn: "7d" });
};

const getRefreshToken = (req) => {
  if (req.body && req.body.refreshToken) return req.body.refreshToken;

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, ...value] = cookie.trim().split("=");
    acc[key] = decodeURIComponent(value.join("="));
    return acc;
  }, {});

  return cookies.refreshToken || null;
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(409).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
      // Generate a mock OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Send Welcome / OTP Email
      const message = `
        <h2>Welcome to ShopMood, ${name}!</h2>
        <p>Thank you for registering on our platform.</p>
        <p>Your one-time verification/discount OTP is: <strong>${otp}</strong></p>
      `;

      await sendEmail({
        email: user.email,
        subject: "Welcome to ShopMood - Your OTP",
        message,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("refreshToken", refreshToken, cookieOptions);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: accessToken,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = getRefreshToken(req);
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    res.json({ token: generateAccessToken(user._id) });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.clearCookie("refreshToken", cookieOptions);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -refreshToken");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
  getUsers,
};
