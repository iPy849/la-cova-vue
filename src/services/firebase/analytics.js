import app from '@/services/firebase/firebaseApp';
import { getAnalytics } from 'firebase/analytics';

export default getAnalytics(app);
