import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import FootprintChart from '@/components/dashboard/FootprintChart';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import NftGallery from '@/components/dashboard/NftGallery';
import LogActivityModal from '@/components/dashboard/LogActivityModal';
import { Card } from '@/components/ui/Card';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch all data in parallel
  const [userData, activityData, nftData] = await Promise.all([
    supabase.from('users').select('*').eq('id', session.user.id).single(),
    supabase.from('activities').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(10),
    supabase.from('nfts').select('*').eq('user_id', session.user.id).order('minted_at', { ascending: false })
  ]);

  if (userData.error || activityData.error || nftData.error) {
    console.error("Data fetching error:", userData.error || activityData.error || nftData.error);
    // Handle error state gracefully in UI
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {userData.data?.username || 'User'}!
        </h1>
        <LogActivityModal />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Carbon Footprint Breakdown</h2>
            <FootprintChart activities={activityData.data || []} />
          </Card>
          <Card>
             <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
             <ActivityFeed activities={activityData.data || []} />
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-2">GreenCred Score</h2>
            <p className="text-5xl font-bold text-green-600">{userData.data?.green_cred_score}</p>
            <p className="text-sm text-gray-500 mt-1">Your social reputation for climate action.</p>
          </Card>
          <Card>
             <h2 className="text-xl font-semibold mb-4">My Carbon Offset NFTs</h2>
             <NftGallery nfts={nftData.data || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}
