import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig.example";

// 1. Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Auth with Persistence only if not already initialized
let auth;
try {
    // getAuth(app) will throw or return an object. 
    // In some versions it might auto-init with memory persistence.
    auth = getAuth(app);

    // If it was already initialized but with memory persistence (default),
    // we might still get the warning. However, Firebase doesn't allow 
    // re-initializing with different persistence easily.
} catch (e) {
    // If not initialized, this is where we set the persistence
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
}

/**
 * Note: If you still see the warning, it's often because another 
 * Firebase service or a previous hot reload call initialized getAuth() 
 * before initializeAuth could be called with persistence.
 * The try-catch block above is the standard way to handle this in Expo.
 */

export { auth };
export default app;
