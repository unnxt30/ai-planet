import React, { useState } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import ChatInput from './QuestionPrompt';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

// Add prop for PDF upload status
interface ChatScreenProps {
  isPdfUploaded: boolean;
}

// Update component to receive props
const ChatScreen: React.FC<ChatScreenProps> = ({ isPdfUploaded }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (message: string) => {
    setMessages(prev => [...prev, { type: 'user', content: message }]);

    try {
      const response = await fetch('http://localhost:8000/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'ai', content: data.answer }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box h="100vh" bg="gray.100" overflowY="auto">
      <VStack align="start" p={8} spaceX={4}>
        {messages.map((message, index) => (
          <Box
            key={index}
            px={4}
            py={2}
            bg={message.type === 'user' ? 'blue.100' : 'white'}
            borderRadius="md"
            boxShadow="sm"
            alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
            maxW="70%"
          >
            <Text>{message.content}</Text>
          </Box>
        ))}
      </VStack>
      <ChatInput onSendMessage={handleSendMessage} isPdfUploaded={isPdfUploaded} />
    </Box>
  );
};

export default ChatScreen;