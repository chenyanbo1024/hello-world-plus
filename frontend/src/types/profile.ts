export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  location?: string;
  email?: string;
  socialLinks: SocialLink[];
  skills?: string[];
  interests?: string[];
}
