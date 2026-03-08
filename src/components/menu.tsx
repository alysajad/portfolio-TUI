import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface MenuItem {
  label: string;
  value: string;
}

interface MenuProps {
  items: MenuItem[];
  onSelect: (value: string) => void;
  direction?: 'column' | 'row';
}

export const Menu: React.FC<MenuProps> = ({ items, onSelect, direction = 'column' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (direction === 'column') {
      if (key.upArrow) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      }
      if (key.downArrow) {
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      }
    } else {
      if (key.leftArrow) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      }
      if (key.rightArrow) {
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      }
    }
    
    // Also support tab navigation between items
    if (input === '\t') {
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    }

    if (key.return) {
      onSelect(items[selectedIndex].value);
    }
  });

  return (
    <Box flexDirection={direction} marginTop={1} gap={direction === 'row' ? 3 : 0}>
      {items.map((item, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Box key={item.value}>
            <Text color={isSelected ? 'cyan' : 'gray'} bold={isSelected}>
              {direction === 'row' ? (isSelected ? '✦ ' : '') : (isSelected ? '  ❯ ' : '    ')}
              {item.label}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};
