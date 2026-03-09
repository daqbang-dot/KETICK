import React from 'react';
import { ThemeToggle } from './ThemeToggle';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Modular */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 p-4">
        <h1 className="text-2xl font-bold tracking-tighter text-blue-600">KETICK</h1>
        <nav className="mt-8 space-y-2">
          {['Dashboard', 'Sales', 'Stock', 'MyInvoice', 'Accounting'].map((item) => (
            <a key={item} href={`/${item.toLowerCase()}`} className="block p-2 rounded hover:bg-blue-50 dark:hover:bg-slate-900">
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-end mb-8">
          <ThemeToggle />
        </header>
        {children}
      </main>
    </div>
  );
};
