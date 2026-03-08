import React from 'react';
import { Box, Text } from 'ink';

export const Footer: React.FC = () => {
  return (
    <Box marginTop={1}>
      <Text color="gray" dimColor>
        {'  '}↑↓ navigate  •  enter select  •  esc back  •  q quit
      </Text>
    </Box>
  );
};
