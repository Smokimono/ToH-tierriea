import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "toh-tierrie", appId: "1:176646315435:web:d6a8c117053f99c09946ee", storageBucket: "toh-tierrie.firebasestorage.app", apiKey: "AIzaSyBCiU7jzcdvLI4r59EQCKQKCSblkprv1V8", authDomain: "toh-tierrie.firebaseapp.com", messagingSenderId: "176646315435" })), provideFirestore(() => getFirestore())
  ]
};
