import React, { useState, useCallback } from 'react';
import { Box, useInput, useApp } from 'ink';
import { Header } from './components/header.js';
import { Footer } from './components/footer.js';
import { HomePage } from './pages/home.js';
import { CreationsPage } from './pages/creations.js';
import { ReflectionsPage } from './pages/reflections.js';
import { ContactPage } from './pages/contact.js';

type Page = 'home' | 'creations' | 'reflections' | 'contact';

export const App: React.FC = () => {
  const { exit } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useInput((input) => {
    if (input === 'q') {
      exit();
    }
  });

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page as Page);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentPage('home');
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'creations':
        return <CreationsPage onBack={handleBack} />;
      case 'reflections':
        return <ReflectionsPage onBack={handleBack} />;
      case 'contact':
        return <ContactPage onBack={handleBack} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <Box flexDirection="column" width={80}>
      {renderPage()}
      <Footer />
    </Box>
  );
};
