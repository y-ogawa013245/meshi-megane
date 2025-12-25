import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";
import { firebaseConfig } from "../config/firebaseConfig.example";

/**
 * Perform anonymous login
 * Note: If API key is placeholder, returns a mock user for development
 */
export const loginAnonymously = async (): Promise<any> => {
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.warn("Using MOCK anonymous login because API Key is not set.");
        return { uid: "dummy-user-123", isAnonymous: true };
    }

    try {
        const userCredential = await signInAnonymously(auth);
        return userCredential.user;
    } catch (error) {
        console.error("Anonymous login error:", error);
        throw error;
    }
};

/**
 * Subscribe to auth state changes
 * Note: If API key is placeholder, immediately triggers callback with mock user
 */
export const subscribeToAuthChanges = (callback: (user: any | null) => void) => {
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        // Simulate auth state change for dummy environment
        setTimeout(() => {
            callback({ uid: "dummy-user-123", isAnonymous: true });
        }, 500);
        return () => { }; // No-op unsubscribe
    }

    return onAuthStateChanged(auth, callback);
};
