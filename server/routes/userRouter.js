import express from "express";
const userRouter = express.Router();


//import the controller
import isAuth from "../middleware/isAuth.js";
import getCurrentUser from "../controllers.js/userController.js";

//mount the routes
userRouter.get("/current-user", isAuth, getCurrentUser); 

//export 
export default userRouter;