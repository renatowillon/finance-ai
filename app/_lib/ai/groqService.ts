// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callGroq(messages: any[]) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        // model: "llama-3.1-8b-instant",
        messages,
        temperature: 0,
        top_p: 1,
        response_format: { type: "json_object" },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro Groq:", data);
    throw new Error("Erro na API Groq");
  }

  return data;
}
