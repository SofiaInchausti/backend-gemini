"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const gemini_routes_1 = __importDefault(require("./routes/gemini.routes"));
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
// Middleware setup
app.use(express_1.default.json()); // Parse incoming JSON requests
app.use((0, cors_1.default)()); // Enable Cross-Origin Resource Sharing
app.use((0, helmet_1.default)()); // Secure the app by setting various HTTP headers
app.use((0, morgan_1.default)("dev")); // Log HTTP requests in 'dev' format
// Mount routes for the "gemini" endpoint
app.use("/gemini", gemini_routes_1.default);
const PORT = Number(process.env.PORT) || 8000;
app.set("port", PORT);
// Start the server if not in "test" environment
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
