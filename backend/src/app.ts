import express from 'express';
import authRoutes from "./routes/auth/auth.route";
import greetingRoutes from "./routes/protected/greetings.route";
import { errorHandler } from './middleware/errorHandler';
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}))

app.use(express.json());

const baseUri = "/api/v1";

// Routes
app.use(baseUri, authRoutes);
app.use(baseUri, greetingRoutes);

app.use(errorHandler);

export default app;