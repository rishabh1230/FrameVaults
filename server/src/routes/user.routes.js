import express from "express";
import multer from "multer"; // for handling file uploads
import passport from "passport";
import {
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = express.Router();

// Configure multer for file uploads (profile pictures)
const upload = multer({ dest: "uploads/" }); // adjust storage as needed

// Public routes
router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, generate tokens and respond
    const user = req.user;

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save();

    // Send tokens and user info in response or redirect as needed
    res.json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  }
);

// Protected routes
router.put("/update/:id", verifyJWT, upload.single("profilePicture"), updateUser);

export default router;

