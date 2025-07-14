import express from 'express';
import { checkauth, loginController, logoutController, signupController } from '../controllers/auth.controller.js';
import { protectRoute} from "../utils/middleware/check.auth.js";

const  authRouter= express.Router();

authRouter.post('/signup',signupController);
authRouter.post('/login',loginController);
authRouter.post('/logout',logoutController);
authRouter.get('/check-auth',protectRoute,checkauth);

export default authRouter;