import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { processGeminiRequest } from "../services/gemini.service";

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
export const geminiController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { input } = req.body;
    const result = await processGeminiRequest(input);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in geminiController:", error);
    // Puedes personalizar el mensaje según el error
    res.status(500).json({ error: "Error processing the request" });
  }
};
