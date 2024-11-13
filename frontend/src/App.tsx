import React from 'react';
import {ChakraProvider, defaultSystem, Theme} from '@chakra-ui/react';
import UploadPDF from './components/FileUpload';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
        <UploadPDF />
    </ChakraProvider>
  );
}

export default App;
