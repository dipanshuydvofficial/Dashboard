export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  ownerId: string;
  createdAt: number;
  updatedAt: number;
}
