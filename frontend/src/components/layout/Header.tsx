import { Link, NavLink } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';

export function Header() {
  const navLinks = [
    { to: '/', label: '首页' },
    { to: '/about', label: '关于' },
  ];

  return (
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
