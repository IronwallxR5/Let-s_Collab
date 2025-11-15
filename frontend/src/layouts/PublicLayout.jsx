import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon } from '@mui/icons-material';
import { useThemeMode } from '../hooks/useThemeMode';

function PublicLayout({ children, showAuth = true }) {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            Let's Collab 🎨
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            {showAuth && (
              <>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '8px 24px',
                    border: '1px solid #6366f1',
                    borderRadius: '8px',
                    background: 'transparent',
                    color: '#6366f1',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  style={{
                    padding: '8px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
}

export default PublicLayout;
