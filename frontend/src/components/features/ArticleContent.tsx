function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 保留中文、字母、数字、下划线、连字符
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatContent = (markdown: string) => {
    return markdown
      // 代码块
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`;
      })
      // 行内代码
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 标题 (带 id 属性用于锚点跳转)
      .replace(/^### (.*$)/gm, (_, text) => `<h3 id="${slugify(text)}">${text}</h3>`)
      .replace(/^## (.*$)/gm, (_, text) => `<h2 id="${slugify(text)}">${text}</h2>`)
      .replace(/^# (.*$)/gm, (_, text) => `<h1 id="${slugify(text)}">${text}</h1>`)
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // 列表项
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      // 表格处理
      .replace(/^\|(.+)\|$/gm, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.some(c => c.trim().match(/^-+$/))) {
          return ''; // 跳过分隔行
        }
        const isHeader = cells.some(c => c.includes('<strong>'));
        if (isHeader) {
          return `<thead><tr>${cells.map(c => `<th>${c.trim()}</th>`).join('')}</tr></thead>`;
        }
        return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`;
      })
      // 段落
      .replace(/\n\n/g, '</p><p>')
      // 换行
      .replace(/\n/g, '<br>');
  };

  const htmlContent = formatContent(content);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
