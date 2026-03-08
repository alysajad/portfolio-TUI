import React from 'react';
import { Box, Text, useInput } from 'ink';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ContactLink {
  label: string;
  url: string;
  icon: string;
}

interface ContactData {
  links: ContactLink[];
}

const contactData: ContactData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'content', 'contact.json'),
    'utf-8'
  )
);

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  useInput((_input, key) => {
    if (key.escape) {
      onBack();
    }
  });

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Text color="cyan" bold>
        ◆ Contact
      </Text>
      <Text color="gray">{'─'.repeat(50)}</Text>
      <Box flexDirection="column" marginTop={1}>
        {contactData.links.map((link) => (
          <Box key={link.label} flexDirection="column" marginBottom={1}>
            <Text color="yellow" bold>
              {link.icon} {link.label}
            </Text>
            <Text color="blue">{'  '}{link.url}</Text>
          </Box>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Press ESC to go back
        </Text>
      </Box>
    </Box>
  );
};
