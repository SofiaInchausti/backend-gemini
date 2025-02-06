# Gemini Backend 🔹
## Description
Gemini Backend is an API that processes text data sent from a prompt. The backend extracts relevant information such as the date, location, description, and any injuries that may have occurred based on the provided text. The data is analyzed to generate structured information in response to user queries.

## The backend is already deploy -> [Backend](https://backend-gemini-6vp6.onrender.com)

## Installation

If you want to install the backend locally, follow these steps:

1. Clone this repository.
2. Run the following command to install dependencies:

   ```bash
   npm install
   npm run dev
    ```

The backend will be up and running locally.

## Technologies Used
- Express: For handling HTTP requests and routing.
- TypeScript: For static typing and better developer experience.
- CORS: For enabling cross-origin resource sharing.
- Helmet: For securing HTTP headers.
- Morgan: For logging HTTP requests.
- Express Validator: For validating incoming request data.
- Vitest for testing

## API Endpoints

POST /processText
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
DB_URL=your_database_url_here
SECRET_KEY=your_secret_key_here
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
## Testing
This project includes end-to-end tests with Vitest. To run the tests, use the following command:
```bash
npm run test

```

