import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new apiError(400, "Content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    });

    if (!tweet) {
        throw new apiError(400, "Tweet not created");
    }

    return res.status(200).json(new apiResponse(200, "Tweet created", tweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            "avatar.url": 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likeDetails",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likeCount: { $size: "$likeDetails" },
                ownerDetails: { $first: "$ownerDetails" },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likeDetails.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                ownerDetails: 1,
                content: 1,
                createdAt: 1,
                likeCount: 1,
                isLiked: 1
            }
        }
    ]);

    return res.status(200).json(new apiResponse(200, "Tweets fetched", tweets));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new apiError(400, "Content is required");
    }

    if (!isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid tweet id");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new apiError(404, "Tweet not found");
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(403, "You are not allowed to update this tweet");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        { new: true }
    );

    if (!updatedTweet) {
        throw new apiError(400, "Tweet not updated");
    }

    return res
        .status(200)
        .json(new apiResponse(200, updatedTweet, "Tweet updated"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid tweet id");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new apiError(404, "Tweet not found");
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(403, "You are not allowed to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);
    return res.status(200).json(new apiResponse(200, "Tweet deleted"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
