import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url'
import { dirname } from "path";
import * as path from 'path';

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const port = process.env.PORT || 5000;
import userRoutes from "./routes/userRoute.js";
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use('/images', express.static(path.resolve(__dirname, 'public/images')));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Server is ready.");
});

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
    console.log(
        `Server is successfully running. Click here for more info: \x1b[34mhttp://localhost:${port}`
    );
});
