"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const gemini_controller_1 = require("../controllers/gemini.controller");
const router = (0, express_1.Router)();
/**
 * POST /
 * Endpoint to process requests for the Gemini AI model.
 *
 * Validates the request body:
 * - `input` is required and must not be null or falsy.
 * - Must be a string, trimmed, and have a length between 5 and 500 characters.
 * - Must not contain special characters like `< > / { } [ ]` to prevent injection attacks.
 *
 * If validation passes, the request is handled by `geminiController`.
 */
/* eslint-disable no-useless-escape */
router.post("/", [
    (0, express_validator_1.body)("input")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Input is required")
        .isString()
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage("Input must be between 5 and 500 characters")
        .matches(/^[^<>\/{}\[\]]+$/)
        .withMessage("Input contains invalid characters"),
], gemini_controller_1.geminiController);
exports.default = router;
