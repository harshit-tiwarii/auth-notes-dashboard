import express from "express";
import { signup, login, getProfile, updateProfile } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);


export { router as authRoute }
