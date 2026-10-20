import DashboardLeaderboardPage from '@/app/dashboard/leaderboard/page';

export const metadata = {
  title: 'Leaderboard | Skaleathon',
  description: 'Official Skaleathon national standings, finalist rankings, and prize results.',
};

export const revalidate = 0;

export default async function LeaderboardPage() {
  const leaderboard = await DashboardLeaderboardPage();
  return (
    <div className="min-h-screen bg-[#0B0B0B] py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {leaderboard}
      </div>
    </div>
  );
}
