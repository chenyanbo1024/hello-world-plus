import { useArticles } from '../hooks';
import { ArticleList } from '../components/features';
import { LoadingSpinner } from '../components/common';

const decorativeLines = [
  { color: 'text-green/60', text: 'import { think, write } from "./brain";' },
  { color: 'text-amber/50', text: 'const topics = ["LLM", "RAG", "Agents"];' },
  { color: 'text-rose/50', text: 'export default async function* explore() {' },
];

export function HomePage() {
  const { articles, loading, error } = useArticles();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-4xl text-center">
        <p className="text-rose">加载文章失败，请稍后再试。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 max-w-4xl">
      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 relative">
        {/* Background grid dots */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-accent) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative">
          {/* Terminal-like header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary border border-border text-xs text-text-muted font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              zsh — blog
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
            <span className="text-text-primary">探索 AI 的</span>
            <br />
            <span className="bg-gradient-to-r from-accent via-purple-400 to-blue-400 bg-clip-text text-transparent">
              无限可能
            </span>
          </h1>

          <p className="text-text-secondary text-lg md:text-xl max-w-xl leading-relaxed mb-8">
            分享关于大语言模型、AI Agent 和系统设计的
            <span className="text-text-primary font-medium">技术见解</span>与
            <span className="text-text-primary font-medium">实践经验</span>
          </p>

          {/* Decorative code lines */}
          <div className="font-mono text-xs leading-loose space-y-1 opacity-60 hidden sm:block">
            {decorativeLines.map((line, i) => (
              <div
                key={i}
                className={`${line.color} fade-up`}
                style={{ animationDelay: `${0.8 + i * 0.15}s` }}
              >
                <span className="text-text-muted/40 select-none mr-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex items-center gap-2 font-mono text-sm text-text-muted">
          <span className="text-accent">//</span>
          <span>最新文章</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        <span className="text-xs text-text-muted font-mono">{articles.length} 篇</span>
      </div>

      {/* Article list */}
      <section className="pb-20">
        <ArticleList articles={articles} />
      </section>
    </div>
  );
}
