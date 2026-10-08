import React from 'react';
import {
  InputBase,
  Paper,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface ChatHistorySearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const ChatHistorySearch: React.FC<ChatHistorySearchProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search chats...',
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        bgcolor: 'action.hover',
        borderRadius: '8px',
        border: '1px solid transparent',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: 'divider',
        },
        '&:focus-within': {
          borderColor: 'primary.main',
          bgcolor: 'background.paper',
        },
      }}
    >
      <SearchIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 0.5 }} />
      <InputBase
        sx={{ ml: 0.5, flex: 1, fontSize: '0.85rem' }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ 'aria-label': 'search conversations' }}
      />
      {value && (
        <IconButton
          size="small"
          onClick={onClear}
          sx={{ p: 0.25, color: 'text.secondary' }}
          aria-label="clear search"
        >
          <ClearIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Paper>
  );
};
