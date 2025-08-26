import React from 'react';
import Header from './Header';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-[100vh] w-full justify-center overflow-hidden">
      <div className="min-h-full w-full max-w-[1024px] overflow-hidden bg-gray-50 p-4 lg:rounded-xl lg:border lg:border-gray-200">
        <Header />
        {children}
      </div>
    </div>
  );
}
