import { LayoutDashboard } from 'lucide-react';

interface AuthViewProps {
  onLogin: () => void;
}

export function AuthView({ onLogin }: AuthViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/20">
          <LayoutDashboard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Dashboard Sync</h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Manage your tasks and metrics across all devices in real-time.
        </p>
        <button
          onClick={onLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors active:scale-[0.98]"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
