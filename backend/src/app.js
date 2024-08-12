import express from "express";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import logger from "./utils/logger.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

const morganFormat = ":method :url :status :response-time ms";
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3]
                };
                const coloredLogObject = {
                    method: chalk.red.bold(logObject.method),
                    url: chalk.blue.bold(logObject.url),
                    status: chalk.yellow.bold(logObject.status),
                    responseTime: chalk.green.bold(logObject.responseTime)
                };
                logger.info(
                    `Method: ${coloredLogObject.method}, URL: ${coloredLogObject.url}, Status: ${coloredLogObject.status}, Response Time: ${coloredLogObject.responseTime}`
                );
            }
        }
    })
);

//common middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());
// cookie-parser is a middleware for Express.js that is used to parse cookies attached to the client request object. Once the cookies are parsed, they can be accessed via req.cookies.

//import routes
import userRouter from "./routes/user.route.js";
import commentRouter from "./routes/comment.route.js";
import likeRouter from "./routes/like.route.js";
import videoRouter from "./routes/video.route.js";
import playlistRouter from "./routes/playlist.route.js";
import tweetRouter from "./routes/tweet.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);

export default app;
