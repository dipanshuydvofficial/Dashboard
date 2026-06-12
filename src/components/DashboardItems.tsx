import { useState } from 'react';
import { Item } from '../types';
import { useItems } from '../hooks/useItems';
import { CheckCircle2, Circle, Clock, Loader2, Plus, Trash2 } from 'lucide-react';
import { UserProfile } from '../types';

export function DashboardItems({ profile }: { profile: UserProfile }) {
  const { items, loading, createItem, updateItemStatus, deleteItem } = useItems(profile);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);
    await createItem(title, description);
    setTitle('');
    setDescription('');
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Add New Item</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add more details..."
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating || !title.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              {isCreating ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">
            {profile.role === 'admin' ? 'All Items' : 'My Items'}
          </h3>
          <span className="text-sm font-medium text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            No items found. Create one above to get started.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <button
                  onClick={() => updateItemStatus(item.id, item.status === 'completed' ? 'pending' : 'completed')}
                  className="mt-1 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : item.status === 'in-progress' ? (
                    <Clock className="w-6 h-6 text-amber-500" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className={`text-base font-medium ${item.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className={`mt-1 text-sm ${item.status === 'completed' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={item.status}
                        onChange={(e) => updateItemStatus(item.id, e.target.value as any)}
                        className={`text-xs font-medium px-2 py-1 rounded-md border shadow-sm outline-none ${
                          item.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          item.status === 'in-progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {profile.role === 'admin' && (
                    <div className="mt-3 text-xs text-slate-500 font-mono">
                      Owner UID: {item.ownerId}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
