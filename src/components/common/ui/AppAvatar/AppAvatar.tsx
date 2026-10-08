import React from 'react';
import { Avatar, type AvatarProps, Badge, styled } from '@mui/material';

export interface AppAvatarProps extends AvatarProps {
  status?: 'online' | 'busy' | 'offline' | 'ai';
  name?: string;
  size?: number;
}

const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor: string }>(({ theme, statusColor }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: statusColor,
    color: statusColor,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export const AppAvatar: React.FC<AppAvatarProps> = ({
  status,
  name,
  size = 36,
  sx,
  ...props
}) => {
  const getInitials = (str?: string) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return '#10B981';
      case 'busy':
        return '#EF4444';
      case 'ai':
        return '#3B82F6';
      default:
        return '#94A3B8';
    }
  };

  const avatar = (
    <Avatar
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: 700,
        background: 'linear-gradient(135deg, #00A3FF 0%, #0284C7 100%)',
        boxShadow: '0 2px 8px rgba(0, 163, 255, 0.25)',
        color: '#ffffff',
        ...sx,
      }}
      {...props}
    >
      {props.children || getInitials(name)}
    </Avatar>
  );

  if (!status) return avatar;

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      statusColor={getStatusColor()}
    >
      {avatar}
    </StyledBadge>
  );
};
