import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import toast from 'react-hot-toast';

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      let errorMessage = 'Authentication failed';
      if (error === 'authentication_failed') {
        errorMessage = 'Google authentication failed. Please try again.';
      } else if (error === 'server_error') {
        errorMessage = 'Server error occurred. Please try again later.';
      }
      toast.error(errorMessage);
      navigate('/login');
      return;
    }

    if (token) {
      // Fetch user data with the token
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            // Store user info with token
            localStorage.setItem('user', JSON.stringify({ ...data.user, token }));
            toast.success('Successfully signed in with Google!');
            navigate('/dashboard');
          } else {
            throw new Error('Failed to fetch user data');
          }
        })
        .catch(err => {
          console.error('Auth callback error:', err);
          // Still try to navigate with the token
          localStorage.setItem('user', JSON.stringify({ token }));
          toast.success('Successfully signed in!');
          navigate('/dashboard');
        });
    } else {
      toast.error('No authentication token received');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
      <Typography variant="h6" sx={{ color: 'white' }}>
        Completing sign in...
      </Typography>
    </Box>
  );
}

export default AuthCallbackPage;
