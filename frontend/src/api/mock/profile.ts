import type { Profile } from '../../types';

export const mockProfile: Profile = {
  name: '3chenng',
  title: '菜鸟',
  avatar: '',
  bio: '在 AI 浪潮狂涌而来的当下，建下此站，记录自己的所学所见所闻，也希望写下的文字能给宇宙下的某一个你启发。',
  location: '深圳，中国',
  email: 'chenyano1024@gmail.com',
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/chenyanbo1024',
      icon: 'github',
    },
    {
      platform: 'X',
      url: 'https://x.com/3chenng',
      icon: 'twitter',
    },
    {
      platform: '博客园',
      url: 'https://www.cnblogs.com/chenyanbo1024',
      icon: 'cnblogs',
    },
    {
      platform: 'Email',
      url: 'mailto:chenyano1024@gmail.com',
      icon: 'email',
    },
  ],
  skills: [
    'C#',
    '.NET',
    'RAG',
    'Python',
    'Go',
    'Docker',
    'Kubernetes',
  ],
  interests: ['大语言模型', 'AI Agent', 'RAG 系统', '开源社区', '技术写作', '系统设计'],
};
