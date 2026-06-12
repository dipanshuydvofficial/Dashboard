import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Item, UserProfile } from '../types';

export function useItems(profile: UserProfile | null) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    // Users only see their own items. Admins theoretically can see all, but here we can query all for admin.
    // If admin wants to see all, we shouldn't filter by ownerId. But for now let's show all items for admin.
    // Wait, Firestore index is needed if we sort by createdAt and filter by ownerId.
    // If not indexed, it will error. In development we can just fetch and let users sort on client, or rely on snapshot without orderBy if filtering by ownerId, or just order by createdAt and don't filter (only if admin).
    // Let's create an appropriate query. No complex composite queries to avoid missing index errors.
    
    let q;
    if (profile.role === 'admin') {
      q = query(collection(db, 'items')); // Admin lists all without composite
    } else {
      q = query(collection(db, 'items'), where('ownerId', '==', profile.id)); // User lists their own
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
      // Sort client-side to avoid composite index requirement initially
      docs.sort((a, b) => {
        const timeA = a.createdAt ? (typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt as any).toMillis?.() || 0) : 0;
        const timeB = b.createdAt ? (typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt as any).toMillis?.() || 0) : 0;
        return timeB - timeA;
      });
      setItems(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'items');
    });

    return () => unsubscribe();
  }, [profile]);

  const createItem = async (title: string, description: string) => {
    if (!profile) return;
    try {
      await addDoc(collection(db, 'items'), {
        title,
        description,
        status: 'pending',
        ownerId: profile.role === 'admin' ? profile.id : profile.id, // For now, admin creates for self, or could assign. We'll simplify.
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'items');
    }
  };

  const updateItemStatus = async (itemId: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      await updateDoc(doc(db, 'items', itemId), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `items/${itemId}`);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'items', itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `items/${itemId}`);
    }
  };

  return { items, loading, createItem, updateItemStatus, deleteItem };
}
