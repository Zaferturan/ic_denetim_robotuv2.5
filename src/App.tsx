import React, { useState, useRef, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import Robot3D from './components/Robot3D';
import { ChatMessage } from './types/chat';
import { callAnythingLLM } from './api/anythingllm';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const Logo = styled.img`
  width: 90px;
  height: auto;
  margin-bottom: 12px;
  @media (max-width: 500px) {
    width: 60px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #007c91;
  margin: 0;
  letter-spacing: 1px;
  @media (max-width: 500px) {
    font-size: 1.2rem;
  }
`;

const ChatContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(245, 245, 245, 0.5);
  height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
  pointer-events: none;
`;

const MessageBubble = styled.div<{ $isBot: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  background-color: ${props => props.$isBot ? 'rgba(74, 144, 226, 0.6)' : '#E3E3E3'};
  color: ${props => props.$isBot ? 'white' : 'black'};
  align-self: ${props => props.$isBot ? 'flex-start' : 'flex-end'};
  text-align: left;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  pointer-events: auto;
`;

const Input = styled.input`
  padding: 12px;
  margin: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  pointer-events: auto;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  pointer-events: auto;
  
  &:hover {
    background-color: #357ABD;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageRef = useRef<string | null>(null);

  const lastBotMessage = messages.filter(m => m.sender === 'bot').slice(-1)[0];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (lastBotMessage) {
      setIsSpeaking(true);
    }
  }, [lastBotMessage?.id]);

  useEffect(() => {
    if (lastBotMessage && isSpeaking && (prevMessageRef.current !== lastBotMessage.id)) {
      // ... TTS kodu (EilikBot tetikleniyor)
      prevMessageRef.current = lastBotMessage.id;
    }
  }, [lastBotMessage, isSpeaking]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const botText = await callAnythingLLM(userMessage.text, sessionId);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        sender: 'bot',
        timestamp: Date.now()
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <AppContainer>
      <Header>
        <Logo src={process.env.PUBLIC_URL + '/nilufer-logo.png'} alt="Nilüfer Belediyesi" />
        <Title>Nilüfer Belediyesi İç Denetim Robotu</Title>
      </Header>
      <Suspense fallback={<div>Loading 3D model...</div>}>
        <Robot3D 
        message={lastBotMessage ? lastBotMessage.text : ''}
          isSpeaking={isSpeaking}
        messageId={lastBotMessage ? lastBotMessage.id : ''}
        onSpeakEnd={() => setIsSpeaking(false)}
      />
      </Suspense>
      <ChatContainer ref={chatContainerRef}>
        {messages.map(message => (
          <MessageBubble key={message.id} $isBot={message.sender === 'bot'}>
            {message.text}
          </MessageBubble>
        ))}
      </ChatContainer>
      <InputContainer>
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Mesajınızı yazın..."
        />
        <Button onClick={sendMessage}>Gönder</Button>
      </InputContainer>
    </AppContainer>
  );
}

export default App; 