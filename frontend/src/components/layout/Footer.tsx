export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted font-mono">
          <p>© {currentYear} alex.blog — <span className="text-accent/60">v0.1.0</span></p>
          <p>
            built with <span className="text-accent">react</span> + <span className="text-accent">tailwind</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
