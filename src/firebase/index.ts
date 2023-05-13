import firebase, { initializeApp } from 'firebase/app'
import { firebaseConfig } from './config'
import { getAuth } from 'firebase/auth'
import { getFirestore, Timestamp } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const FirebaseTimestamp = Timestamp
