import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors"
import dbConnect from "./config/dbConnect.js";
import dotenv from "dotenv"
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import interviewRouter from "./routes/interviewRouter.js";
dotenv.config();



//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5173"
    ],
    credentials: true
}))


//routes middleware
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);


//db connection
await dbConnect();

//conecting the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`port is listening at ${port}`)
})

app.get("/", (req, res) => {
    res.send("Welcome to the home page");
})



