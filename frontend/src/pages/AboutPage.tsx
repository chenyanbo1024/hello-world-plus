import { useProfile } from '../hooks';
import { ProfileCard } from '../components/features';
import { LoadingSpinner } from '../components/common';

export function AboutPage() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <p className="text-red-400">加载个人信息失败，请稍后再试。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">关于我</h1>
        <p className="text-lg text-text-secondary">了解更多关于我的信息</p>
      </header>

      <ProfileCard profile={profile} />
    </div>
  );
}
