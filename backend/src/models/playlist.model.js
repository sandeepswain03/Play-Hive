import { Schema, model } from "mongoose";

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        description: {
            type: String,
            required: [true, "Discription is required"]
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

export const Playlist = model("Playlist", playlistSchema);
