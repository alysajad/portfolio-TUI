import React from 'react';
import { Box, Text } from 'ink';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Menu } from '../components/menu.js';
import { Header } from '../components/header.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profileArt = fs.readFileSync(
  path.join(__dirname, '..', 'ascii', 'profile.txt'),
  'utf-8'
).replace(/\r/g, '');

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const menuItems = [
  { label: 'Creations', value: 'creations' },
  { label: 'Reflections', value: 'reflections' },
  { label: 'Contacts', value: 'contact' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <Box flexDirection="row" width={85}>
      {/* Left Column: ASCII Profile */}
      <Box marginRight={2} flexShrink={0}>
        <Text color="gray">{profileArt}</Text>
      </Box>

      {/* Right Column: Hero Content */}
      <Box flexDirection="column" flexGrow={1} justifyContent="flex-start" paddingTop={1}>
        <Header />
        
        {/* Intro */}
        <Box flexDirection="column" marginBottom={1}>
          <Text color="cyan" bold>SAJAD HUSSAIN MALLA</Text>
          <Text color="gray">
            Cybersecurity Analyst & B.Tech
          </Text>
          <Text color="gray">
            CS Undergrad.
          </Text>
          <Text color="gray">
            12x Hackathon Winner, builder & hacker.
          </Text>
        </Box>

        <Box flexDirection="column" marginBottom={1}>
          <Text color="gray">
            Working as a Cybersecurity Analyst at
          </Text>
          <Text color="gray">
            ElevateLabs, where he performs
          </Text>
          <Text color="gray">
            vulnerability scans & analyzes network traffic.
          </Text>
          <Text color="gray">
            Sajad leads technical initiatives at
          </Text>
          <Text color="gray">
            ACES, coordinating cybersecurity workshops
          </Text>
          <Text color="gray">
            and bootcamps.
          </Text>
        </Box>

        <Box flexDirection="column" marginBottom={1}>
          <Text color="gray">
            Curious about system security, networking,
          </Text>
          <Text color="gray">
            and creative engineering.
          </Text>
          <Text color="gray">
            Explore the directories below to
          </Text>
          <Text color="gray">
            learn more ↓
          </Text>
        </Box>

        {/* Navigation */}
        <Box flexDirection="column">
          <Menu items={menuItems} onSelect={onNavigate} direction="row" />
        </Box>
      </Box>
    </Box>
  );
};
