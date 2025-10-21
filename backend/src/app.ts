import express from 'express';
import authRoutes from "./routes/auth/auth.route";
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

const baseUri = "/api/v1";

// Routes
app.use(baseUri, authRoutes);

app.use(errorHandler);

export default app;