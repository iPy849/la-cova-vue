import app from '@/services/firebase/firebaseApp';
import { getFirestore } from 'firebase/firestore';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;
