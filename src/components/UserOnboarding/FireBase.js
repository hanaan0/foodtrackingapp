import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0R6OZttRvhwW7jOvzc8pabuqnjJZaj2I",
  authDomain: "food-11777.firebaseapp.com",
  projectId: "food-11777",
  storageBucket: "food-11777.firebasestorage.app",
  messagingSenderId: "1017643321381",
  appId: "1:1017643321381:web:a422d172a8f0fd8cc097cc",
  measurementId: "G-YPTF3DDJQD",
};

// Initialise Firebase app
const app = initializeApp(firebaseConfig);

// Initialise Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
