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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/gemini.e2e.test.ts
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
// Mock to simulate a successful response from the Gemini API
vitest_1.vi.mock("@google/generative-ai", () => {
    return {
        GoogleGenerativeAI: vitest_1.vi.fn().mockImplementation(() => {
            return {
                getGenerativeModel: vitest_1.vi.fn().mockReturnValue({
                    generateContent: vitest_1.vi.fn().mockResolvedValue({
                        response: {
                            // The text() function simulate Gemini's response in text format
                            text: () => `{
                  "date": "2025-02-04",
                  "location": "unknown",
                  "description": "Test incident",
                  "injuries": false,
                  "owner": true,
                  "complete": true,
                  "question": ""
                }`,
                        },
                    }),
                }),
            };
        }),
    };
});
// Import the app after configuring the mock
const index_1 = require("../index");
(0, vitest_1.describe)("E2E: Pruebas del endpoint /gemini", () => {
    (0, vitest_1.it)("should return a valid response for a correct input", () => __awaiter(void 0, void 0, void 0, function* () {
        const validInput = {
            input: "This is a test incident report that occurred today at my house with no injuries.",
        };
        const response = yield (0, supertest_1.default)(index_1.app).post("/gemini").send(validInput);
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toEqual({
            date: "2025-02-04",
            location: "unknown",
            description: "Test incident",
            injuries: false,
            owner: true,
            complete: true,
            question: "",
        });
        // Ensure the response contains expected types for each field
        (0, vitest_1.expect)(response.body).toEqual(vitest_1.expect.objectContaining({
            date: vitest_1.expect.any(String),
            location: vitest_1.expect.any(String),
            description: vitest_1.expect.any(String),
            injuries: vitest_1.expect.any(Boolean),
            owner: vitest_1.expect.any(Boolean),
            complete: vitest_1.expect.any(Boolean),
            question: vitest_1.expect.any(String),
        }));
    }));
    (0, vitest_1.it)("should return an error if no input is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).post("/gemini").send({});
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body).toHaveProperty("errors");
        (0, vitest_1.expect)(response.body.errors[0].msg).toMatch(/Input is required/);
    }));
    (0, vitest_1.it)("should return an error if the input is too short", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).post("/gemini").send({ input: "Hi" });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body).toHaveProperty("errors");
        // Example error message (adjust according to your validator configuration)
        (0, vitest_1.expect)(response.body.errors[0].msg).toMatch(/Input must be between 5 and 500 characters/);
    }));
    (0, vitest_1.it)("should return an error if the input is too long", () => __awaiter(void 0, void 0, void 0, function* () {
        const longInput = "a".repeat(1000);
        const response = yield (0, supertest_1.default)(index_1.app)
            .post("/gemini")
            .send({ input: longInput });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body).toHaveProperty("errors");
        (0, vitest_1.expect)(response.body.errors[0].msg).toMatch(/Input must be between 5 and 500 characters/);
    }));
    (0, vitest_1.it)("should return an error if the input contains invalid characters", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .post("/gemini")
            .send({ input: "<script>alert('attack')</script>" });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body).toHaveProperty("errors");
        (0, vitest_1.expect)(response.body.errors[0].msg).toMatch(/Input contains invalid characters/);
    }));
});
