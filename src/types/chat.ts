export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export interface AnythingLLMResponse {
  message: string;
  threadId: string;
} 