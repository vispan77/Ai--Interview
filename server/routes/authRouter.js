import express from "express";
const authRouter = express.Router();




//import the controller
import { googleAuth, logout } from "../controllers.js/authController.js";


//mount the routes
authRouter.post("/google", googleAuth);
authRouter.get("/logout", logout);


//export 
export default authRouter;