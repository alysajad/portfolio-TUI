import React from 'react';
import { Text, Box } from 'ink';

const BANNER = `
    _____ ___       _____    ____ 
   / ___//   |     / /   |  / __ \\
   \\__ \\/ /| |__  / / /| | / / / /
  ___/ / ___ / /_/ / ___ |/ /_/ / 
 /____/_/  |_\\____/_/  |_/_____/  
`;

export const Header: React.FC = () => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="cyan" bold>
        {BANNER.replace(/^\n/, '')}
      </Text>
    </Box>
  );
};
