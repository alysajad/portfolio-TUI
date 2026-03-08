import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Post {
  title: string;
  body: string;
}

interface Category {
  category: string;
  posts: Post[];
}

const reflectionData: Category[] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'content', 'reflections.json'),
    'utf-8'
  )
);

interface ReflectionsPageProps {
  onBack: () => void;
}

type ViewState =
  | { level: 'categories'; selectedIndex: number }
  | { level: 'posts'; catIndex: number; selectedIndex: number }
  | { level: 'reading'; catIndex: number; postIndex: number; scrollOffset: number };

export const ReflectionsPage: React.FC<ReflectionsPageProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>({
    level: 'categories',
    selectedIndex: 0,
  });

  useInput((input, key) => {
    if (key.escape) {
      if (view.level === 'categories') {
        onBack();
      } else if (view.level === 'posts') {
        setView({ level: 'categories', selectedIndex: view.catIndex });
      } else if (view.level === 'reading') {
        setView({
          level: 'posts',
          catIndex: view.catIndex,
          selectedIndex: view.postIndex,
        });
      }
      return;
    }

    if (view.level === 'categories') {
      const count = reflectionData.length;
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
          level: 'posts',
          catIndex: view.selectedIndex,
          selectedIndex: 0,
        });
      }
    } else if (view.level === 'posts') {
      const count = reflectionData[view.catIndex].posts.length;
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
          level: 'reading',
          catIndex: view.catIndex,
          postIndex: view.selectedIndex,
          scrollOffset: 0,
        });
      }
    } else if (view.level === 'reading') {
      // Scroll support in reading mode
      if (key.upArrow && view.scrollOffset > 0) {
        setView({ ...view, scrollOffset: view.scrollOffset - 1 });
      } else if (key.downArrow) {
        setView({ ...view, scrollOffset: view.scrollOffset + 1 });
      }
    }
  });

  // ── Category list ──
  if (view.level === 'categories') {
    return (
      <Box flexDirection="column">
        <Text color="cyan" bold>
          {'  '}◆ Reflections
        </Text>
        <Text color="gray">{'  ─'.repeat(16)}</Text>
        <Box flexDirection="column" marginTop={1}>
          {reflectionData.map((cat, i) => {
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

  // ── Post list within category ──
  if (view.level === 'posts') {
    const cat = reflectionData[view.catIndex];
    return (
      <Box flexDirection="column">
        <Text color="cyan" bold>
          {'  '}◆ {cat.category}
        </Text>
        <Text color="gray">{'  ─'.repeat(16)}</Text>
        <Box flexDirection="column" marginTop={1}>
          {cat.posts.map((post, i) => {
            const isSelected = i === view.selectedIndex;
            return (
              <Box key={post.title}>
                <Text color={isSelected ? 'green' : 'white'} bold={isSelected}>
                  {isSelected ? '  ❯ ' : '    '}
                  {post.title}
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

  // ── Reading view ──
  const post = reflectionData[view.catIndex].posts[view.postIndex];
  const lines = post.body.split('\n');
  const visibleLines = lines.slice(view.scrollOffset, view.scrollOffset + 20);

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Text color="cyan" bold>
        ◆ {post.title}
      </Text>
      <Text color="gray">{'─'.repeat(50)}</Text>
      <Box marginTop={1} flexDirection="column">
        {visibleLines.map((line, i) => (
          <Text key={i} color="white">
            {line}
          </Text>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          ↑↓ to scroll  •  esc to go back
        </Text>
      </Box>
    </Box>
  );
};
