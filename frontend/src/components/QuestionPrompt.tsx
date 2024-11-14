import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack
} from '@chakra-ui/react';

interface ChatProps {
  onSendMessage: (message: string) => void;
  isPdfUploaded: boolean;
}

const ChatInput: React.FC<ChatProps> = ({ onSendMessage, isPdfUploaded }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '') {
      try {
        const response = await fetch('http://localhost:8000/question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: inputValue.trim()
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send question');
        }

        const data = await response.json();
        onSendMessage(inputValue);
        setInputValue('');
      } catch (error) {
        console.error('Error sending question:', error);
      }
    }
  };

  return (
    <Box position="fixed" bottom="0" left="0" w="full" bg="white" borderTop="1px solid" borderColor="gray.200" p={4}>
      <Flex alignItems="center">
        <Input
          placeholder={isPdfUploaded ? "Type your message..." : "Please upload a PDF first"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          borderRadius="full"
          pr={16}
          disabled={!isPdfUploaded}
        />
        <Button
          colorScheme={isPdfUploaded ? "blue" : "gray"}
          fontWeight="bold"
          ml={4}
          onClick={handleSendMessage}
          disabled={!isPdfUploaded}
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
};

export default ChatInput;