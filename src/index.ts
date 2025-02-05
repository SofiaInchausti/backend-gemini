import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import geminiRoutes from "./routes/gemini.routes";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(helmet());  // Secure the app by setting various HTTP headers
app.use(morgan("dev"));  // Log HTTP requests in 'dev' format

// Mount routes for the "gemini" endpoint
app.use("/gemini", geminiRoutes);


const PORT: number = Number(process.env.PORT) || 8000;
app.set("port", PORT);

// Start the server if not in "test" environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export { app };