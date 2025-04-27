import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../UserOnboarding/FireBase";

export const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Function to load user-specific items
  const loadUserItems = async (uid) => {
    if (!uid) return;
    try {
      const storedItems = await AsyncStorage.getItem(`items-${uid}`);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems).map((item) => ({
          ...item,
          date: new Date(item.date),
        }));
        setItems(parsedItems);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  // Listen for user login changes (new user detected)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.uid !== userId) {
          setUserId(user.uid);
          await loadUserItems(user.uid);
        }
      } else {
        setUserId(null);
        setItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save items when they change
  useEffect(() => {
    const saveItems = async () => {
      if (userId) {
        try {
          await AsyncStorage.setItem(`items-${userId}`, JSON.stringify(items));
        } catch (error) {
          console.error("Error saving items:", error);
        }
      }
    };
    if (userId) saveItems();
  }, [items, userId]);

  return (
    <ItemsContext.Provider value={{ items, setItems, userId }}>
      {children}
    </ItemsContext.Provider>
  );
};
