import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

const FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const createApiError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeModel = (model) => model.replace(/^models\//, "").trim();

async function generateWithModel(model, prompt) {
  const response = await ai.models.generateContent({
    model: normalizeModel(model),
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      maxOutputTokens: 8192,
    },
  });

  return response.text;
}

async function main(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw createApiError("Gemini API key is not configured on the server.", 503);
  }

  const configuredModel = process.env.GEMINI_MODEL
    ? normalizeModel(process.env.GEMINI_MODEL)
    : null;

  const modelsToTry = [
    ...new Set([
      ...(configuredModel ? [configuredModel] : []),
      DEFAULT_MODEL,
      ...FALLBACK_MODELS,
    ]),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      return await generateWithModel(model, prompt);
    } catch (error) {
      lastError = error;
      const status = error.status || error.statusCode;

      if (status === 429) {
        throw createApiError(
          "AI generation quota exceeded. Wait a minute and try again.",
          429
        );
      }

      if (status === 404) {
        console.warn(`Gemini model unavailable: ${model}`);
        continue;
      }

      break;
    }
  }

  console.error("Gemini generation failed:", lastError?.message || lastError);

  if (lastError?.status === 404 || lastError?.statusCode === 404) {
    throw createApiError(
      "No supported Gemini model is available for this API key. Try setting GEMINI_MODEL=gemini-2.5-flash-lite in server/.env.",
      400
    );
  }

  throw createApiError("Failed to generate content. Please try again later.", 502);
}

export default main;
