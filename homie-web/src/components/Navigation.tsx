'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { name: 'Search', href: '/', icon: '🔍' },
  { name: 'Map', href: '/map', icon: '🗺️' },
  { name: 'Saved', href: '/saved', icon: '❤️' },
  { name: 'Post', href: '/post', icon: '➕' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">Homie - Find Your Home</h1>
            <div className="flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-1 min-w-0 flex-1 ${
                pathname === item.href
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile header */}
      <header className="md:hidden bg-blue-600 text-white p-4">
        <h1 className="text-lg font-bold text-center">Find Your Home</h1>
      </header>
    </>
  );
}
