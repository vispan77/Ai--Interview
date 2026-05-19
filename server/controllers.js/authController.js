import User from "../models/user.js";
import jwt from "jsonwebtoken";

//sign in api
const googleAuth = async (req, res) => {
    try {
        //fetch the data from the req k body
        const { name, email, avatar } = req.body;
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email is not found"
            })
        }
        //find the user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar
            })
        }

        //sent the token with user id
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        //send this token in the cookie with the reposnse
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Authenticatin successfully",
            data: user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Something wrong the google auth ${error}`
        })
    }
}

//logout api
const logout = async (req, res) => {
    try {
        res.clearCookie("token").status(200).json({
            success: true,
            message: "Loggout successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `logout error ${error}`
        })
    }
}

export {
    googleAuth,
    logout
}