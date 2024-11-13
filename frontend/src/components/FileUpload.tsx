'use client'

import React, { useState, ChangeEvent } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'

export default function FileUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.')
      return
    }

    setIsUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:8000/upload', {

        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      console.log('Upload successful:', data)
      setUploadStatus('File uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('Error uploading file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

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
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload">
            <Button as="span"  colorScheme="blue">
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
          _loading={{
            bg: 'red.500',
            color: 'white',
          }}
          colorScheme="green"
          disabled={!selectedFile || isUploading}
        >
          Upload File
        </Button>

        {uploadStatus && (
          <Text
            color={uploadStatus.includes('successfully') ? 'green.500' : 'red.500'}
            fontWeight="bold"
          >
            {uploadStatus}
          </Text>
        )}
      </VStack>
    </Container>
  )
}