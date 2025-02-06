// tests/gemini.e2e.test.ts
import request from "supertest";
import { describe, it, expect, vi } from "vitest";

// Mock to simulate a successful response from the Gemini API
vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContent: vi.fn().mockResolvedValue({
            response: {
              // The text() function simulate Gemini's response in text format
              text: () =>
                `{
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
import { app } from "../index";

describe("E2E: Pruebas del endpoint /gemini", () => {
  it("should return a valid response for a correct input", async () => {
    const validInput = {
      input:
        "This is a test incident report that occurred today at my house with no injuries.",
    };

    const response = await request(app).post("/gemini").send(validInput);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      date: "2025-02-04",
      location: "unknown",
      description: "Test incident",
      injuries: false,
      owner: true,
      complete: true,
      question: "",
    });
    // Ensure the response contains expected types for each field
    expect(response.body).toEqual(
      expect.objectContaining({
        date: expect.any(String),
        location: expect.any(String),
        description: expect.any(String),
        injuries: expect.any(Boolean),
        owner: expect.any(Boolean),
        complete: expect.any(Boolean),
        question: expect.any(String),
      }),
    );
  });

  it("should return an error if no input is provided", async () => {
    const response = await request(app).post("/gemini").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toMatch(/Input is required/);
  });

  it("should return an error if the input is too short", async () => {
    const response = await request(app).post("/gemini").send({ input: "Hi" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    // Example error message (adjust according to your validator configuration)
    expect(response.body.errors[0].msg).toMatch(
      /Input must be between 5 and 500 characters/,
    );
  });

  it("should return an error if the input is too long", async () => {
    const longInput = "a".repeat(1000);
    const response = await request(app)
      .post("/gemini")
      .send({ input: longInput });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toMatch(
      /Input must be between 5 and 500 characters/,
    );
  });

  it("should return an error if the input contains invalid characters", async () => {
    const response = await request(app)
      .post("/gemini")
      .send({ input: "<script>alert('attack')</script>" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toMatch(
      /Input contains invalid characters/,
    );
  });
});
