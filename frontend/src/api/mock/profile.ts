import type { Profile } from '../../types';

export const mockProfile: Profile = {
  name: 'Alex Chen',
  title: 'AI 工程师 & 技术博主',
  avatar: '',
  bio: '热爱人工智能和开源技术。专注于 LLM 应用开发、RAG 系统构建和 AI Agent 设计。目前在大厂从事 AI 基础设施相关工作，业余时间分享技术见解和实践经验。',
  location: '北京，中国',
  email: 'alex@example.com',
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/alexchen',
      icon: 'github',
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/alexchen',
      icon: 'twitter',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/alexchen',
      icon: 'linkedin',
    },
    {
      platform: 'Email',
      url: 'mailto:alex@example.com',
      icon: 'email',
    },
  ],
  skills: [
    'PyTorch',
    'LangChain',
    'Transformer',
    'RAG',
    'Python',
    'Go',
    'React',
    'Docker',
    'Kubernetes',
  ],
  interests: ['大语言模型', 'AI Agent', 'RAG 系统', '开源社区', '技术写作', '系统设计'],
};
