import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import chalk from "chalk";

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(
                chalk.green.bold.italic(`Server running on port ${PORT}`)
            );
        });
    })
    .catch((error) => {
        logger.error(
            chalk.red.bold.italic("Error connecting to MongoDB", error)
        );
    });
