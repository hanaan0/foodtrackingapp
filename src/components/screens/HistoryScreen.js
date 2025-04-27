import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../layout/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItemsContext } from "../data/ItemsContext";

const HistoryScreen = () => {
  // Context and state ---------------------------
  const { userId } = useContext(ItemsContext);
  const [history, setHistory] = useState([]);

  // Load user history ---------------------------
  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return;
      try {
        const savedHistory = await AsyncStorage.getItem(`history-${userId}`);
        if (savedHistory !== null) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error("Error loading history:", error);
      }
    };

    loadHistory();
  }, [userId]);

  // Main view -----------------------------------
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Saving History</Text>

        {/* History List */}
        {history.length > 0 ? (
          history.map((entry, index) => (
            <View key={index} style={styles.entry}>
              <Text style={styles.date}>{entry.date}</Text>
              <Text style={styles.amount}>{entry.amount} Saved</Text>
            </View>
          ))
        ) : (
          <Text>No history yet.</Text>
        )}
      </ScrollView>
    </Screen>
  );
};

// Styles -----------------------------------
const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  entry: {
    marginBottom: 12,
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amount: {
    fontSize: 16,
  },
});

export default HistoryScreen;
