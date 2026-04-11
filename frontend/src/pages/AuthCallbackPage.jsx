import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login', { 
        state: { error: 'Authentication failed. Please try again.' } 
      });
      return;
    }

    if (!token) {
      console.error('No token received');
      navigate('/login', { 
        state: { error: 'No authentication token received.' } 
      });
      return;
    }


    // Fetch user data with the token
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        return res.json();
      })
      .then(data => {
        if (data.user) {
          // Store user info with token in auth store
          setUser({ ...data.user, token });
          
          // Also persist in localStorage for consistency
          localStorage.setItem('user', JSON.stringify({ ...data.user, token }));
          
          // Redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error('No user data received');
        }
      })
      .catch(err => {
        console.error('Auth callback error:', err);
        localStorage.removeItem('token');
        navigate('/login', { 
          state: { error: 'Failed to complete sign in. Please try again.' } 
        });
      });
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary mb-6" size={60} />
      <h2 className="text-xl font-semibold text-foreground">
        Signing you in...
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Please wait while we complete your authentication
      </p>
    </div>
  );
}

export default AuthCallbackPage;
