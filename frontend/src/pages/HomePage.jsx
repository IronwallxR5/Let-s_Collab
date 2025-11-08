import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  Brush as BrushIcon,
  FlashOn as FlashOnIcon,
  Lock as LockIcon,
  People as PeopleIcon,
  Cloud as CloudIcon,
  Devices as DevicesIcon,
} from '@mui/icons-material';

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BrushIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Drawing Tools',
      description: 'Complete set of drawing tools including pen, shapes, text, and more for creative expression',
    },
    {
      icon: <FlashOnIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
      title: 'Real-Time Sync',
      description: 'See changes instantly as your team collaborates. Every stroke appears in real-time',
    },
    {
      icon: <LockIcon sx={{ fontSize: 48, color: 'success.main' }} />,
      title: 'Secure & Private',
      description: 'Control permissions with viewer, editor, and owner roles. Your data stays protected',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Team Collaboration',
      description: 'Invite unlimited collaborators and work together seamlessly on any project',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 48, color: 'info.main' }} />,
      title: 'Auto-Save',
      description: 'Never lose your work. Everything is automatically saved and synced to the cloud',
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 48, color: 'error.main' }} />,
      title: 'Works Everywhere',
      description: 'Access your whiteboards from any device - desktop, tablet, or mobile',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white' }}>
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
            }}
          >
            Let's Collab 🎨
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="contained" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}
          >
            Collaborate in Real-Time on Digital Whiteboards
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 5,
              maxWidth: 700,
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.5rem' },
            }}
          >
            Create, share, and collaborate on whiteboards with your team. Perfect for brainstorming, design, and project planning.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.1rem',
              }}
            >
              View Demo
            </Button>
          </Stack>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: 700 }}
          >
            Everything You Need to Collaborate
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: 10,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            borderRadius: 4,
            color: 'white',
            mb: 8,
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to Start Collaborating?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of teams already using Let's Collab
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Create Free Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
