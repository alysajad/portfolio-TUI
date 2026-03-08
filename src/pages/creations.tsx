import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Project {
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
}

interface Category {
  category: string;
  projects: Project[];
}

const projectData: Category[] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'content', 'projects.json'),
    'utf-8'
  )
);

interface CreationsPageProps {
  onBack: () => void;
}

type ViewState =
  | { level: 'categories'; selectedIndex: number }
  | { level: 'projects'; catIndex: number; selectedIndex: number }
  | { level: 'detail'; catIndex: number; projIndex: number };

export const CreationsPage: React.FC<CreationsPageProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>({
    level: 'categories',
    selectedIndex: 0,
  });

  useInput((input, key) => {
    if (key.escape) {
      if (view.level === 'categories') {
        onBack();
      } else if (view.level === 'projects') {
        setView({ level: 'categories', selectedIndex: view.catIndex });
      } else if (view.level === 'detail') {
        setView({
          level: 'projects',
          catIndex: view.catIndex,
          selectedIndex: view.projIndex,
        });
      }
      return;
    }

    if (view.level === 'categories') {
      const count = projectData.length;
      if (key.upArrow) {
        setView({
          ...view,
          selectedIndex: view.selectedIndex > 0 ? view.selectedIndex - 1 : count - 1,
        });
      } else if (key.downArrow) {
        setView({
          ...view,
          selectedIndex: view.selectedIndex < count - 1 ? view.selectedIndex + 1 : 0,
        });
      } else if (key.return) {
        setView({
          level: 'projects',
          catIndex: view.selectedIndex,
          selectedIndex: 0,
        });
      }
    } else if (view.level === 'projects') {
      const count = projectData[view.catIndex].projects.length;
      if (key.upArrow) {
        setView({
          ...view,
          selectedIndex: view.selectedIndex > 0 ? view.selectedIndex - 1 : count - 1,
        });
      } else if (key.downArrow) {
        setView({
          ...view,
          selectedIndex: view.selectedIndex < count - 1 ? view.selectedIndex + 1 : 0,
        });
      } else if (key.return) {
        setView({
          level: 'detail',
          catIndex: view.catIndex,
          projIndex: view.selectedIndex,
        });
      }
    }
  });

  // ── Category list ──
  if (view.level === 'categories') {
    return (
      <Box flexDirection="column">
        <Text color="cyan" bold>
          {'  '}◆ Creations
        </Text>
        <Text color="gray">{'  ─'.repeat(16)}</Text>
        <Box flexDirection="column" marginTop={1}>
          {projectData.map((cat, i) => {
            const isSelected = i === view.selectedIndex;
            return (
              <Box key={cat.category}>
                <Text color={isSelected ? 'green' : 'white'} bold={isSelected}>
                  {isSelected ? '  ❯ ' : '    '}
                  {cat.category}
                </Text>
              </Box>
            );
          })}
        </Box>
        <Box marginTop={1}>
          <Text color="gray" dimColor>
            {'  '}esc to go back
          </Text>
        </Box>
      </Box>
    );
  }

  // ── Project list within category ──
  if (view.level === 'projects') {
    const cat = projectData[view.catIndex];
    return (
      <Box flexDirection="column">
        <Text color="cyan" bold>
          {'  '}◆ {cat.category}
        </Text>
        <Text color="gray">{'  ─'.repeat(16)}</Text>
        <Box flexDirection="column" marginTop={1}>
          {cat.projects.map((proj, i) => {
            const isSelected = i === view.selectedIndex;
            return (
              <Box key={proj.name}>
                <Text color={isSelected ? 'green' : 'white'} bold={isSelected}>
                  {isSelected ? '  ❯ ' : '    '}
                  {proj.name}
                </Text>
              </Box>
            );
          })}
        </Box>
        <Box marginTop={1}>
          <Text color="gray" dimColor>
            {'  '}esc to go back
          </Text>
        </Box>
      </Box>
    );
  }

  // ── Project detail ──
  const project = projectData[view.catIndex].projects[view.projIndex];
  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Text color="cyan" bold>
        ◆ Project: {project.name}
      </Text>
      <Text color="gray">{'─'.repeat(50)}</Text>
      <Box marginTop={1} flexDirection="column">
        <Text color="white">{project.description}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text color="yellow" bold>
          Tech Stack:
        </Text>
        <Text color="green">  {project.techStack.join('  •  ')}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text color="yellow" bold>
          GitHub:
        </Text>
        <Text color="blue">{`  ${project.githubUrl}`}</Text>
      </Box>
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Press ESC to go back
        </Text>
      </Box>
    </Box>
  );
};
