import jwt from "jsonwebtoken"
import User from "../models/user.js";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "token not found"
            })
        };
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(404).json({
                success: false,
                message: "token is not valid"
            })
        };
        req.user = await User.findById(decode.id);

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Something wrong to get the user from the tokek ${error}`
        })
    }
}

export default isAuth;