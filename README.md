# Gemini Backend 🔹

## Description
Gemini Backend is an API that processes text data sent from a prompt. The backend extracts relevant information such as the date, location, description, and any injuries that may have occurred based on the provided text. The data is analyzed to generate structured information in response to user queries.

## The backend is already deploy -> [Backend](https://backend-gemini-1.onrender.com)

## Technologies Used
- Express: for handling HTTP requests and routing.
- TypeScript: for static typing and better developer experience.
- CORS: for enabling cross-origin resource sharing.
- Helmet: for securing HTTP headers.
- Morgan: for logging HTTP requests.
- Express Validator: for validating incoming request data.
- Vitest: for testing
- Docker for containerizing the application.
- Husky: To enforce pre-commit hooks for linting, prettier, and running tests.
- GitHub Actions: CI pipeline for linting, testing, and deploying
- Render for hosting

## Installation

1. Clone this repository.
2. Run the following command to install dependencies:

   ```bash
   npm install
   npm run dev
    ```
The backend will be up and running locally.

## Docker
To run the backend using Docker, you can build and start a container with the following commands:

Build the Docker image and run the Docker container::
   ```bash
   docker build -t gemini-backend .
   docker run -p 3001:3000 -e GEMINI_API_KEY="PROVIDED API KEY" gemini-backend
   ```
This will start the backend inside a Docker container, and you can access it on http://localhost:8000.

## API Endpoints

POST /gemini
This endpoint processes the given text to extract information.

Request Body (JSON):
```bash
{
  "text": "Description of the incident"
}

```
Response (JSON):
```bash
{
 "date": "2025-01-31",
 "location": "domicilio titular",
 "description": "House fire",
 "injuries": false,
 "owner": true,
 "complete": true,
 "question": ""
}

```

## Environment Variables
Create a .env file in the root directory and define the following variables:

```bash
PORT = port_preference
GEMINI_API_KEY = api_key 
```

## Usage
Once the server is running, you can send a POST request to the /processText endpoint via Postman or any other HTTP client. Here's an example of how to do it using Postman:

1.  Set the HTTP method to POST.
2.  Enter the URL: http://localhost:5000/gemini.
3.  In the body, select raw and JSON and send the request with the following structure:
   
```bash
{
  "text": "Description of the incident"
}
```

## GitHub Actions Pipeline
A pipeline is set up to ensure that your code works correctly when pushing to the main. The pipeline includes:

Linting: Checks for code style and formatting issues.
Prettier: Ensures consistent code formatting.
Tests: Runs Vitest to check the correctness of your code.
The pipeline will automatically run when a push is made to the main or develop branches. Here's the GitHub Actions YAML pipeline:

## Automatic Deployment to Render
Every time a change is pushed to the main branch, the GitHub Actions pipeline triggers an automatic deployment to Render. The deployment process is managed through a GitHub Action that makes a request to Render’s API.

## Husky 
Husky is configured to ensure that linting, prettier formatting, and testing happen before you commit or push any code. The following hooks are set up:

- **Pre-commit**: Ensures code is properly formatted with Prettier and free of linting errors before committing.
- **Pre-push**: Lints the code and runs the tests before pushing changes.

To use Husky, ensure that you have it set up in your project. Husky will run these checks automatically when you try to commit or push code, helping to enforce code quality.

## Testing
This project includes end-to-end tests with Vitest. To run the tests, use the following command:

```bash
npm run test
```




