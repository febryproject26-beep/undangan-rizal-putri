import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA-J8oiD-x-G4jo68gOaR53OjMp_yqqDGE',
  authDomain: 'undangan-rizal-putri.firebaseapp.com',
  projectId: 'undangan-rizal-putri',
  storageBucket: 'undangan-rizal-putri.firebasestorage.app',
  messagingSenderId: '671885871501',
  appId: '1:671885871501:web:2c2eb98021da83b64b95c4',
  measurementId: 'G-H5S85Q7S08',
};

// Inisialisasi Firebase App & Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper: Format waktu relatif dalam Bahasa Indonesia
export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Baru Saja';

  let date;
  if (typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    return 'Baru Saja';
  }

  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

  if (diffInSeconds < 60) {
    return 'Baru Saja';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} hari yang lalu`;
  }
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Helper: Warna avatar berdasarkan kategori
export function getAvatarBg(category) {
  switch (category) {
    case 'Sahabat':
      return 'bg-primary-fixed-dim text-on-primary-fixed';
    case 'Rekan Kerja':
      return 'bg-tertiary-fixed text-on-tertiary-fixed';
    case 'Keluarga':
      return 'bg-surface-container-high text-on-surface';
    case 'Alumni Kampus':
      return 'bg-secondary-fixed text-on-secondary-fixed';
    default:
      return 'bg-primary-container text-on-primary-container';
  }
}

/**
 * Berlangganan (listen) perubahan ucapan secara real-time dari Firestore
 * @param {Function} onUpdate - callback saat data diperbarui
 * @param {Function} onError - callback saat ada error
 * @returns {Function} fungsi unsubscribe listener
 */
export function subscribeToWishes(onUpdate, onError) {
  const wishesRef = collection(db, 'wishes');
  const q = query(wishesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const wishes = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || 'Tamu Undangan',
          initial: (data.name || 'T').trim().charAt(0).toUpperCase(),
          avatarBg: data.avatarBg || getAvatarBg(data.category),
          category: data.category || 'Sahabat',
          attendance: data.attendance || 'hadir',
          isAttending: data.attendance === 'hadir' || data.isAttending === true,
          pax: data.pax || '1 Orang',
          message: data.message || '',
          timeAgo: formatRelativeTime(data.createdAt),
          createdAt: data.createdAt,
        };
      });
      onUpdate(wishes);
    },
    (error) => {
      console.error('Firebase Firestore error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Simpan ucapan baru ke Firestore
 * @param {Object} wishData - { name, category, attendance, pax, message }
 */
export async function createFirestoreWish(wishData) {
  const wishesRef = collection(db, 'wishes');
  const docRef = await addDoc(wishesRef, {
    name: wishData.name.trim(),
    category: wishData.category || 'Keluarga',
    attendance: wishData.attendance || 'hadir',
    isAttending: wishData.attendance === 'hadir',
    pax: wishData.pax || '1 Orang',
    message: wishData.message.trim(),
    avatarBg: getAvatarBg(wishData.category),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

