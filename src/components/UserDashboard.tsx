import { UserProfile } from '../types';
import { DashboardItems } from './DashboardItems';

export function UserDashboard({ profile }: { profile: UserProfile }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Dashboard</h2>
        <p className="text-slate-500 mt-1">Manage your personal tasks and metrics seamlessly.</p>
      </div>
      <DashboardItems profile={profile} />
    </div>
  );
}
