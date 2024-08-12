import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";

const accessTokenExpiry = async function (req, res, next) {
    // CHECK FOR ACCESS TOKEN
    try {
        const accessToken = req.cookies.accessToken || req.body.accessToken;
        const decodedAccessToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedAccessToken?._id).select(
            "-password -refreshToken"
        );

        req.user = user;
        next();
    } catch (error) {
        if (error.name == "TokenExpiredError") {
            const incomingRefreshToken =
                req.cookies.refreshToken || req.body.refreshToken;

            if (!incomingRefreshToken) {
                throw new apiError(
                    401,
                    "unable to fetch refreshtoken from cookie or body"
                );
            }
            const decodedRefreshToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
            const user = User.findById(decodedRefreshToken._id);

            if (user.refreshToken !== incomingRefreshToken) {
                throw new apiError(401, "Refresh token is not valid");
            }

            const accessToken = user.GenerateAccessToken();

            const options = {
                httpOnly: true,
                secure: true
            };

            res.cookies("accessToken", accessToken, options);
            next();
        }

        throw new apiError(409, error.message);
    }
};

export default accessTokenExpiry;
