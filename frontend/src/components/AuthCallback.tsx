import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleCallback(code);
    }
  }, [searchParams]);

  const handleCallback = async (code: string) => {
    try {
      await axios.get(`${BACKEND_URL}/auth/callback?code=${code}`, {
        withCredentials: true
      });
      navigate('/');
    } catch (error) {
      console.error('Auth callback error:', error);
      toast({
        title: 'Authentication Error',
        description: 'Failed to complete authentication. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    }
  };

  return null;
}