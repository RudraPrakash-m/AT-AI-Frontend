import React from 'react';
import { Tooltip, type TooltipProps } from '@mui/material';

export interface AppTooltipProps extends TooltipProps {
  description?: string;
}

export const AppTooltip: React.FC<AppTooltipProps> = ({
  children,
  title,
  placement = 'top',
  arrow = true,
  enterDelay = 300,
  ...props
}) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      {...props}
    >
      {children}
    </Tooltip>
  );
};
