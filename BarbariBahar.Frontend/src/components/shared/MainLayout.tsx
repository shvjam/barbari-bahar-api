// src/components/shared/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from './MainHeader';

const MainLayout: React.FC = () => {
  return (
    <div>
      <MainHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
