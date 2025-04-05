import express from "express"
import { getUser, login, signup } from "../controllers/user.controller.js";
import { getVerifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', getVerifyToken, getUser)

export default router;