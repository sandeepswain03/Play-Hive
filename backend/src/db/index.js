import mongoose from "mongoose";
import logger from "../utils/logger.js";
import chalk from "chalk";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${DB_NAME}`
        );
        logger.info(
            chalk.blue.bold.italic(`connected to MongoDB,DB_host: ${connectionInstance.connection.host}`)
        );
    } catch (error) {
        logger.warn(chalk.red.bold.italic("Error connecting to MongoDB", error));
        process.exit(1);
    }
};

export default connectDB;
