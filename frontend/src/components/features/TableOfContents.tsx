import { useEffect, useRef, useState } from 'react';
import type { Heading } from '../../utils/extractHeadings';

interface TableOfContentsProps {
  headings: Heading[];
  isOpen: boolean;
  onToggle: () => void;
}

export function TableOfContents({ headings, isOpen, onToggle }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    headingElements.forEach((el) => observerRef.current!.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80; // Account for sticky header
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Desktop floating TOC — always visible on the left, fixed position */}
      <div className="hidden md:block fixed left-0 top-1/4 -translate-y-1/2 z-30 pl-4">
        <div className="relative flex flex-col items-center">
          {/* Toggle button */}
          <button
            onClick={onToggle}
            className="
              w-8 h-8 rounded-md bg-bg-card/90 border border-border
              flex items-center justify-center
              text-text-muted hover:text-accent hover:border-accent/40
              backdrop-blur-sm transition-all duration-200
            "
            aria-label={isOpen ? '收起目录' : '展开目录'}
            title={isOpen ? '收起目录' : '展开目录'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : '-rotate-90'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown panel — floats to the right of the button */}
          {isOpen && (
            <div
              className="
                absolute left-full top-0 ml-3
                w-52 bg-bg-card/95 border border-border rounded-lg
                backdrop-blur-sm shadow-xl shadow-black/20
                p-3
                max-h-[60vh] overflow-y-auto
              "
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider">目录</span>
                <span className="text-xs text-text-muted ml-auto">({headings.length})</span>
              </div>

              {/* Heading list */}
              <nav>
                <ul className="space-y-0.5">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={`
                          w-full text-left text-xs py-1 leading-snug rounded
                          transition-colors duration-150
                          ${
                            activeId === heading.id
                              ? 'text-accent font-medium bg-accent-dim'
                              : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
                          }
                        `}
                        style={{
                          paddingLeft: heading.level === 1 ? '4px' : heading.level === 2 ? '12px' : '20px',
                        }}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Mobile FAB button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-bg-card border border-border shadow-lg flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
        aria-label="打开目录"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={onToggle}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile TOC drawer */}
      <div
        className={`
          md:hidden fixed bottom-0 left-0 right-0 z-50
          bg-bg-card border-t border-border rounded-t-2xl
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="flex justify-center pt-3 pb-2">
          <button
            onClick={onToggle}
            className="w-10 h-1 rounded-full bg-border-bright"
            aria-label="关闭目录"
          />
        </div>

        <div className="px-6 pb-8 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">目录</span>
            <span className="text-xs text-text-muted">({headings.length})</span>
          </div>
          <nav>
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`
                      w-full text-left text-sm py-1.5 leading-snug rounded
                      transition-colors duration-150
                      ${
                        activeId === heading.id
                          ? 'text-accent font-medium'
                          : 'text-text-secondary hover:text-text-primary'
                      }
                    `}
                    style={{
                      paddingLeft: heading.level === 1 ? '4px' : heading.level === 2 ? '12px' : '24px',
                    }}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
