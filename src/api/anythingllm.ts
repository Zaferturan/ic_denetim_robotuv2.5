import { ANYTHINGLLM_API_KEY, ANYTHINGLLM_API_URL } from "../config/anythingllm_api_key";

export async function callAnythingLLM(message: string, sessionId?: string) {
  try {
    const response = await fetch(ANYTHINGLLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`
      },
      body: JSON.stringify({
        message: message,
        mode: "chat",
        sessionId: sessionId || `session-${Date.now()}`,
        reset: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.textResponse;
  } catch (error) {
    console.error('AnythingLLM API Error:', error);
    throw error;
  }
} 