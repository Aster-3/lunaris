import React from 'react';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Folders } from './pages/Folders';
import { Library } from './pages/Library';
import { Menu } from './pages/Menu';
import { useAppStore } from './store/useAppStore';

export const MainTabs = () => {
  const selectedPage = useAppStore((state) => state.selectedPage);

  const renderContent = () => {
    switch (selectedPage) {
      case 'home':
        return <Home />;
      case 'folders':
        return <Folders />;
      case 'library':
        return <Library />;
      case 'menu':
        return <Menu />;
      default:
        return <Home />;
    }
  };

  return <MainLayout>{renderContent()}</MainLayout>;
};
