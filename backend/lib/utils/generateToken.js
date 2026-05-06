import jwt from "jsonwebtoken"

export const generateTokens = async(userId) =>{
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN, {expiresIn: "15m"});

    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN, {expiresIn: "7d"});

    return {accessToken, refreshToken};
}


export const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 15*60*1000
    });

    res.cookie("refresh", refreshToken, {
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7*24*60*60*1000
    });
}