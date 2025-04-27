import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { ItemsContext } from "../data/ItemsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const InventoryScreen = ({ navigation }) => {
  // Context and states
  const { userId } = useContext(ItemsContext);
  const [spaces, setSpaces] = useState([]);
  const [newSpace, setNewSpace] = useState("");
  const isFocused = useIsFocused();

  // Load spaces when screen is focused
  useEffect(() => {
    if (userId && isFocused) {
      loadSpaces();
    }
  }, [userId, isFocused]);

  const loadSpaces = async () => {
    try {
      const saved = await AsyncStorage.getItem(`spaces-${userId}`);
      if (saved) {
        setSpaces(JSON.parse(saved));
      } else {
        setSpaces(["Fridge", "Freezer", "Pantry"]); // Default spaces
      }
    } catch (err) {
      console.error("Error loading spaces:", err);
    }
  };

  const saveSpaces = async (updatedSpaces) => {
    setSpaces(updatedSpaces);
    await AsyncStorage.setItem(
      `spaces-${userId}`,
      JSON.stringify(updatedSpaces)
    );
  };

  // Handle adding a new space
  const handleAddSpace = () => {
    if (!newSpace.trim()) return Alert.alert("Enter a space name");
    if (spaces.includes(newSpace)) return Alert.alert("Space already exists");

    const updated = [...spaces, newSpace.trim()];
    saveSpaces(updated);
    setNewSpace("");
  };

  // Handle deleting a space and its items
  const confirmDeleteSpace = (space) => {
    Alert.alert(
      "Delete Space",
      `Are you sure you want to delete "${space}" and all items inside it?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteSpace(space),
        },
      ]
    );
  };

  const handleDeleteSpace = async (spaceToDelete) => {
    try {
      // Remove space from list
      const updatedSpaces = spaces.filter((space) => space !== spaceToDelete);
      await saveSpaces(updatedSpaces);

      // Remove items linked to that space
      const storedItems = await AsyncStorage.getItem(`items-${userId}`);
      let itemsArray = storedItems ? JSON.parse(storedItems) : [];

      const filteredItems = itemsArray.filter(
        (item) => item.space !== spaceToDelete
      );

      await AsyncStorage.setItem(
        `items-${userId}`,
        JSON.stringify(filteredItems)
      );
    } catch (error) {
      console.error("Error deleting space and items:", error);
    }
  };

  // Navigate to space detail
  const handleSelectSpace = (space) => {
    navigation.navigate("SpaceDetailScreen", { space });
  };

  // Main view
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Your Spaces</Text>

      {/* List of spaces */}
      <FlatList
        data={spaces}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            style={styles.spaceItem}
            onPress={() => handleSelectSpace(item)}
            onLongPress={() => confirmDeleteSpace(item)}
          >
            <Text style={styles.spaceText}>{item}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>No spaces yet</Text>}
      />

      {/* Add new space input */}
      <TextInput
        style={styles.input}
        placeholder="Add new space (e.g. Fridge)"
        value={newSpace}
        onChangeText={setNewSpace}
      />
      <Pressable style={styles.button} onPress={handleAddSpace}>
        <Text style={styles.buttonText}>Add Space</Text>
      </Pressable>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#d1e7d1" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  spaceItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  spaceText: { fontSize: 18, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default InventoryScreen;
