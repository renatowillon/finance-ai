import OpenAi from "openai";

export const groq = new OpenAi({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
