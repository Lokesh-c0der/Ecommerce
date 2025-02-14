import express from "express";
import { loginUser, myProfile, registerUser, verifyUser } from "../Controllers/User.js";
import { isAuth } from "../Middleware/isAuth.js";



const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/profile",isAuth, myProfile);

export default router;