// Firebase configuration and utilities
// This file provides the structure for Firebase integration
// Users need to configure their own Firebase project

export const FIREBASE_CONFIG = {
  // Users should replace these with their actual Firebase config
  // Get these values from Firebase Console > Project Settings > General > Your apps
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Firestore Collections Structure:
export const COLLECTIONS = {
  SEASONS: 'seasons',
  RESERVATIONS: 'reservations'
} as const;

// Firestore Document Structure:
/*
seasons collection:
{
  id: string (auto-generated)
  name: string
  createdAt: timestamp
  userId: string (for user isolation)
}

reservations collection:
{
  id: string (auto-generated)
  seasonId: string (reference to season)
  date: string (YYYY-MM-DD format)
  name: string
  surname: string
  address: string
  phone: string
  menu: string
  deposit: number
  hall: string
  createdAt: timestamp
  userId: string (for user isolation)
}
*/

// Firestore Security Rules:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /seasons/{seasonId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /reservations/{reservationId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
*/

// For now, we'll use mock data and local storage
// Once Firebase is configured, replace these with actual Firebase calls
export const initializeFirebase = () => {
  console.log('Firebase configuration needed. Please check src/lib/firebase.ts for setup instructions.');
};