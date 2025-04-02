import { Box, Container, Flex, Heading, Spinner, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/auth/me`, {
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    }
  });

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/login`, {
        withCredentials: true
      });
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'Failed to initiate login. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/logout`, {}, {
        withCredentials: true
      });
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Error',
        description: 'Failed to logout. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" fontSize="xl">
        <Heading>Email Knowledge Base Builder</Heading>
        {!isAuthenticated ? (
          <Box mt={8}>
            <Text mb={4}>Please login with your Microsoft account to continue</Text>
            <Button colorScheme="blue" onClick={handleLogin}>
              Login with Microsoft
            </Button>
          </Box>
        ) : (
          <Routes>
            <Route path="/" element={<EmailDashboard onLogout={handleLogout} />} />
            <Route path="/callback" element={<AuthCallback />} />
          </Routes>
        )}
      </Box>
    </Container>
  );
}

export default App;