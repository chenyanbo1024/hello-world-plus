export function Footer() {
  const currentYear = new Date().getFullYear();
  const icpNumber = "京ICP备XXXXXXXX号-X"; // 占位符，备案通过后替换为实际备案号
  const siteStartDate = new Date("2024-01-01"); // 网站上线日期，请修改为实际日期

  // 计算运行天数
  const runningDays = Math.floor(
    (Date.now() - siteStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Copyright */}
        <div className="text-center text-xs text-text-muted font-mono mb-3">
          Copyright © {currentYear} 某某的个人博客. All Rights Reserved.
        </div>

        {/* 运行时间 */}
        <div className="text-center text-xs text-text-muted font-mono mb-3">
          本站已运行 <span className="text-accent">{runningDays}</span> 天
        </div>

        {/* ICP备案信息 */}
        <div className="text-center text-xs text-text-muted font-mono">
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            {icpNumber}
          </a>
        </div>
      </div>
    </footer>
  );
}
