import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { SearchModal } from '../common/SearchModal';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const navLinks = [
    { to: '/', label: '首页' },
    { to: '/about', label: '关于' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between max-w-4xl">
          <Link
            to="/"
            className="flex items-center gap-1 text-base font-bold text-text-primary hover:text-accent transition-colors font-mono tracking-tight"
          >
            <span className="text-accent opacity-50">$</span>
            <span>
              abo<span className="text-accent">.blog</span>
              <span className="cursor-blink text-accent ml-0.5">▎</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-accent bg-accent-dim'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <span className="mx-1 w-px h-4 bg-border" />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-all duration-200"
              aria-label="搜索"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
