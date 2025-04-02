import { Box, Button, Container, Flex, Heading, SimpleGrid, Text, useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface EmailDashboardProps {
  onLogout: () => void;
}

export function EmailDashboard({ onLogout }: EmailDashboardProps) {
  const toast = useToast();

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/emails/folders`, {
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching folders:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch email folders',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return [];
      }
    }
  });

  const { data: emails, isLoading: emailsLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/emails/preview`, {
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching emails:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch emails',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return [];
      }
    }
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading size="lg">Email Dashboard</Heading>
        <Button onClick={onLogout} colorScheme="red" variant="outline">
          Logout
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Box>
          <Heading size="md" mb={4}>Email Folders</Heading>
          {foldersLoading ? (
            <Text>Loading folders...</Text>
          ) : folders?.length > 0 ? (
            folders.map((folder: any) => (
              <Box key={folder.id} p={4} borderWidth={1} borderRadius="md" mb={2}>
                <Text>{folder.displayName}</Text>
              </Box>
            ))
          ) : (
            <Text>No folders found</Text>
          )}
        </Box>

        <Box>
          <Heading size="md" mb={4}>Recent Emails</Heading>
          {emailsLoading ? (
            <Text>Loading emails...</Text>
          ) : emails?.length > 0 ? (
            emails.map((email: any) => (
              <Box key={email.id} p={4} borderWidth={1} borderRadius="md" mb={2}>
                <Text fontWeight="bold">{email.subject}</Text>
                <Text fontSize="sm" color="gray.500">{email.from}</Text>
              </Box>
            ))
          ) : (
            <Text>No emails found</Text>
          )}
        </Box>
      </SimpleGrid>
    </Container>
  );
}