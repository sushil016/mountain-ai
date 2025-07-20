import React from 'react';
import { Outlet } from 'react-router-dom';
import { FloatingNavbar } from './floating-navbar';
import { Footer } from './footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
