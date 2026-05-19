
const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User found successfully",
            data: user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Something went wrong while fetching the user ${error}`
        })
    }
}

export default getCurrentUser;