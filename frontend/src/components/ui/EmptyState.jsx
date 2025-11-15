import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  iconSize = 80,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 10,
        px: 3,
      }}
    >
      {icon && (
        <Box sx={{ fontSize: iconSize, color: 'text.secondary', mb: 2 }}>
          {icon}
        </Box>
      )}
      {title && (
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          size="large"
          onClick={onAction}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
