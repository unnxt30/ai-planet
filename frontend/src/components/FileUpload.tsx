import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Link,
} from '@chakra-ui/react';

interface UploadPDFProps {
  onUploadSuccess: () => void;
}

const UploadPDF: React.FC<UploadPDFProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadStatus('Only PDF files are allowed.');
        return;
      }
      setSelectedFile(file);
      setUploadStatus(null);
      setFileUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      setFileUrl(data.file_url);
      setUploadStatus('File uploaded successfully!');
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spaceX={8} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg">File Upload</Heading>
          {selectedFile && (
            <Text fontWeight="bold" fontSize="md">
              Selected file: {selectedFile.name}
            </Text>
          )}
        </Flex>

        <Box>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf"
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload">
            <Button as="span" colorScheme="blue">
              Choose File
            </Button>
          </label>
          {selectedFile && (
            <Text mt={2}>
              File selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Text>
          )}
        </Box>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          colorScheme="green"
          _disabled={{
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>

        {uploadStatus && (
          <Text
            color={uploadStatus.includes('successfully') ? 'green.500' : 'red.500'}
            fontWeight="bold"
          >
            {uploadStatus}
          </Text>
        )}

        {fileUrl && (
          <Box>
            <Text fontWeight="bold">File URL:</Text>
            <Link href={fileUrl} color="blue.500">
              {fileUrl}
            </Link>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default UploadPDF;