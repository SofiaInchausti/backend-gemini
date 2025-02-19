import { GoogleGenerativeAI } from "@google/generative-ai";
import GeminiResponse from "../utils/GeminiResponseType";
import dotenv from "dotenv";
dotenv.config();

// Load the Gemini API key from enviroment variables
const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY || "";
if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

// Initialize the Google Generative AI model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function processGeminiRequest(
  input: string,
): Promise<GeminiResponse> {
  const currentDate = new Date().toISOString().split("T")[0];

  // Construct the prompt with detailed instructions for the AI model
  const prompt = `
  Eres una IA especializada en analizar reportes de incidentes y extraer información estructurada. Recibirás un párrafo en lenguaje natural que describe una situación (por ejemplo, un incidente, robo, accidente, etc.) y deberás devolver **exclusivamente** un JSON válido que contenga los siguientes campos:
  
  1. **date**: Fecha del suceso en formato "yyyy-mm-dd".
     - Si el verbo en el párrafo está en pasado y no se menciona una fecha explícita, deberás preguntar al usuario con una de las siguientes variantes:
     - "¿Podrías indicar la fecha exacta en que ocurrió el suceso?"
     - "Mencionaste un evento pasado, ¿recuerdas cuándo ocurrió exactamente?"
     - "Para completar el reporte, ¿puedes decirme el día en que sucedió?"
     - Si se menciona una fecha relativa precisa como "ayer", "hace 3 días", "hace 2 semanas", conviértela en una fecha exacta usando la fecha actual: ${currentDate}.
     - Si la fecha es relativa pero imprecisa ("la semana pasada", "el mes pasado", "el año pasado"), no asignes una fecha exacta.
     - Si el verbo está en presente (indicando que ocurre en este momento), asigna automáticamente la fecha actual.
     - No asignes ninguna fecha si no se menciona y no hay indicios claros del tiempo.
  
  2. **location**: Dirección o punto geográfico.
     - Si no se menciona una ubicación explícita en el texto, asigna el valor "desconocido".
  
  3. **description**: Un resumen claro y conciso de la situación.
     - Si el párrafo incluye referencias como "mi casa" o "mi trabajo", utiliza en la descripción los términos "Casa del titular" o "Trabajo del usuario" respectivamente.
  
  4. **injuries**: Valor booleano (true o false).
     - true si se indica o se infiere que hay heridos en el incidente.
     - false si no se menciona la presencia de heridos.
  
  5. **owner**: Valor booleano (true o false).
     - true si se deduce que el usuario es el titular o propietario del objeto/protagonista del suceso.
     - false en caso contrario.
  
  6. **complete**: Valor booleano (true o false).
     - true si el párrafo proporciona toda la información necesaria para completar los campos anteriores (date, location, description, injuries y owner).
     - false si falta alguno de esos datos.
  
  7. **question**: Cadena de texto.
     - Si complete es false, este campo debe contener una pregunta en lenguaje natural solicitando la información faltante. Para hacer la conversación más fluida, usa una de las siguientes opciones de acuerdo con la información faltante:
       - Para la fecha: 
         - "Parece que no mencionaste la fecha exacta, ¿puedes indicarla?"
         - "¿Recuerdas qué día sucedió el incidente?"
         - "Para mayor precisión, ¿podrías decirme cuándo ocurrió?"
       - Para la ubicación:
         - "No veo una ubicación en el reporte, ¿puedes decirme dónde ocurrió?"
         - "¿Dónde exactamente sucedió el suceso?"
         - "Si puedes compartir la dirección o lugar, será de ayuda."
       - Si faltan varios datos: 
         - "Faltan algunos detalles para completar el informe. ¿Podrías indicar la fecha y la ubicación?"
         - "Para completar el reporte, me ayudaría saber la fecha y el lugar del suceso."
     - Si complete es true, agrega un campo "message" con una despedida amigable. Algunas opciones pueden ser:
        "Gracias por la información. ¡Si necesitas algo más, aquí estoy!"
        "Perfecto, he registrado tu reporte. ¡Estoy aquí si necesitas algo más!"
        "Listo, tu reporte está completo. ¡Que tengas un buen día!"
  
  **IMPORTANTE:**
  - Devuelve únicamente el JSON resultante, sin texto adicional, sin explicaciones y sin bloques de código de formato.
  - Asegúrate de que el JSON incluya **únicamente** los campos indicados.

  Texto a analizar:
  "${input}"
  `;

  try {
    // Execute the API call with a timeout of 10 seconds
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout esperando respuesta")),
          40000,
        ),
      ),
    ]);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const textResponse = (result as any).response.text();

    // Clean up and parse the response to extract valid JSON
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("The response from Gemini does not contain a valid JSON.");
    }

    const cleanTextResponse = jsonMatch[0].trim();
    const parsedResponse: GeminiResponse = JSON.parse(cleanTextResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Error processing Gemini request:", error);
    throw new Error("Failed to process request"); // Return a generic error message to avoid exposing implementation details
  }
}
