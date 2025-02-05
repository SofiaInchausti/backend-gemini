"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiController = void 0;
const express_validator_1 = require("express-validator");
const gemini_service_1 = require("../services/gemini.service");
/**
 * Controller for handling requests to the Gemini AI processing service.
 *
 * This function:
 * 1. **Validates the request body** using `express-validator`.
 *    - If validation fails, returns a 400 Bad Request response with the error details.
 * 2. **Processes the request** by calling `processGeminiRequest(input)`,
 *    which interacts with the Gemini AI model.
 * 3. **Handles errors gracefully**:
 *    - If an error occurs during processing, logs it and returns a 500 Internal Server Error response.
 */
const geminiController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { input } = req.body;
        const result = yield (0, gemini_service_1.processGeminiRequest)(input);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error in geminiController:", error);
        // Puedes personalizar el mensaje según el error
        res.status(500).json({ error: "Error processing the request" });
    }
});
exports.geminiController = geminiController;
