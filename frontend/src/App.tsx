import React, { useState } from 'react';
import {ChakraProvider, defaultSystem, Theme} from '@chakra-ui/react';
import UploadPDF from './components/FileUpload';
import ChatScreen from './components/Chat';

function App() {
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  return (
    <ChakraProvider value={defaultSystem}>
        <UploadPDF onUploadSuccess={() => setIsPdfUploaded(true)} />
        <ChatScreen isPdfUploaded={isPdfUploaded} />
    </ChakraProvider>
  );
}

export default App;
