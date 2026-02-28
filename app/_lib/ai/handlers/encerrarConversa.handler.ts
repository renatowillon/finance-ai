import { clearPending } from "@/app/_lib/ai/conversationState";

export async function encerrarConversaHandler(userId: number) {
  clearPending(userId);

  return {
    reply: "Tudo bem, qualquer coisa e so chamar.",
  };
}
