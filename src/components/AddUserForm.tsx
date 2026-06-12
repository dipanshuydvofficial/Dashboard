import { useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { createSecondaryUser } from '../lib/firebase';

export function AddUserForm({ onUserAdded }: { onUserAdded?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || password.length < 6) {
      setError('Please provide a valid email and a password of at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createSecondaryUser(email, password);
      // Wait, createSecondaryUser handles user Auth creation but does NOT create the Firestore user doc.
      // Wait, we designed createSecondaryUser earlier. I need to make sure createSecondaryUser ALSO creates the doc, OR I create the doc right here.
      // Ah! I only wrote createSecondaryUser in lib/firebase.ts to return uid.
      // Actually, I should create the user doc here.
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const { db, handleFirestoreError, OperationType } = await import('../lib/firebase');
      
      // Wait, createSecondaryUser will return the UID. But wait, I need to know what createSecondaryUser returns.
      // Yes, I returned the uid from it!
      const uid = await createSecondaryUser(email, password);
      
      await setDoc(doc(db, 'users', uid), {
        email,
        role,
        createdAt: serverTimestamp()
      });

      setSuccess('User successfully added!');
      setEmail('');
      setPassword('');
      setRole('user');
      if (onUserAdded) onUserAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-slate-500" />
        Add New User
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="user@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
          {loading ? 'Adding User...' : 'Create User'}
        </button>
      </div>
    </form>
  );
}
