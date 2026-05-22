import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../config/multer.js";
import { analyseResume, generateQuestions, submitAnswer, finishInterview } from "../controllers.js/interviewController.js";

const interviewRouter = express.Router();

//import the controller


//mount the router
interviewRouter.post("/resume", isAuth, upload.single("resume"), analyseResume);
interviewRouter.post("/generate-questions", isAuth, generateQuestions);
interviewRouter.post("/submit-answer", isAuth, submitAnswer);
interviewRouter.post("/finish", isAuth, finishInterview)



//export the router
export default interviewRouter;
