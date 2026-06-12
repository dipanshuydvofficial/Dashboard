import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { AuthView } from './components/AuthView';

export default function App() {
  const { user, profile, loading, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthView onGoogleLogin={loginWithGoogle} onEmailLogin={loginWithEmail} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 w-full shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-inner">
              D
            </div>
            <h1 className="font-semibold text-lg tracking-tight">Dashboard Sync</h1>
            <span className="text-[10px] font-bold tracking-wider bg-slate-100/80 text-slate-500 px-2.5 py-1 rounded-md uppercase border border-slate-200">
              {profile.role} MODE
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span className="text-slate-500 hidden sm:inline-block">{profile.email}</span>
            <button 
              onClick={logout}
              className="text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {profile.role === 'admin' ? (
          <AdminDashboard profile={profile} />
        ) : (
          <UserDashboard profile={profile} />
        )}
      </main>
    </div>
  );
}
