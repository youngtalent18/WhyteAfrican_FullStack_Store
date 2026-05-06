import User from "../model/userModel.js"
import jwt from "jsonwebtoken"

export const protectRoute = async (req,res,next) => {
    try{
        const accessToken = req.cookies.accessToken;

        if(!accessToken){
            return res.status(401).json({
                error: "error, unavailable token"
            })
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

            if(!decoded){
                return res.status(400).json({
                    error: "invalid token"
                })
            }

            const user = await User.findById(decoded.userId).select("-password");

            if(!user){
                return res.status(404).json({
                    error: "User not found"
                })
            }

            req.user = user;
            next();
        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({
                    error: "unauthourized-token expired"
                })
            }
        }

    }catch(error){
        console.log("Error in protectRoute controller", error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

export const adminRoute = async (req, res, next) => {
    try{
        if(req.user && req.user.role === "admin"){
            next();
        }else{
            return res.status(400).json({
                error: "Admin access only"
            })
        }
    }catch(error){
        console.log("Error in protectRoute controller", error);
        return res.status(500).json({
            error: "internal server error"
        });
    }
}