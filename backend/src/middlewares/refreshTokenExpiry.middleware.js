import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const refreshTokenExpiry = async function (req, res, next) {
    // REFRESH TOKEN CHECK
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        next();
    } catch (error) {
        if (error.name == "TokenExpiredError") {
            try {
                await User.findByIdAndUpdate(
                    decodedRefreshToken._id,
                    {
                        $set: {
                            refreshToken: null
                        }
                    },
                    {
                        new: true
                    }
                );
            } catch (error) {
                console.log(error);
            }

            const options = {
                httpOnly: true,
                secure: true
            };

            return res
                .status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(
                    new apiResponse(
                        200,
                        {},
                        "User logged Out because Refresh TOken is Expired"
                    )
                );
        }

        throw new apiError(401, error.message);
    }
};

export default refreshTokenExpiry;
