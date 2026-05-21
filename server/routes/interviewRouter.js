import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../config/multer.js";
import { analyseResume } from "../controllers.js/interviewController.js";

const interviewRouter = express.Router();

//import the controller


//mount the router
interviewRouter.post("/resume", isAuth, upload.single("resume"), analyseResume)



//export the router
export default interviewRouter;
