import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import config from '../utils/config';
import {getAnalytics} from 'firebase/analytics';

const firebaseConfig = config.firebase_config;
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

const storage = getStorage(app);

export default storage;
