import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { ItemsContext } from "../data/ItemsContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SpaceDetailScreen = () => {
  // Context and navigation
  const { items, setItems, userId } = useContext(ItemsContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { space } = route.params;

  // Filter items by space
  const filteredItems = items.filter((item) => item.space === space);

  // Handle delete an individual item
  const confirmDeleteItem = (itemIndex) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDeleteItem(itemIndex),
      },
    ]);
  };

  const handleDeleteItem = async (itemIndex) => {
    const updatedItems = items.filter((_, index) => index !== itemIndex);
    setItems(updatedItems);
    await AsyncStorage.setItem(`items-${userId}`, JSON.stringify(updatedItems));
  };

  // Main view
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{space} Items</Text>

      {/* List of items in the selected space */}
      {filteredItems.length === 0 ? (
        <Text>No items in this space.</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.itemBox}
              onLongPress={() => confirmDeleteItem(index)}
            >
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDate}>
                Expires: {new Date(item.date).toDateString()}
              </Text>
            </Pressable>
          )}
        />
      )}

      {/* Add item button */}
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate("AddingScreen", { space })}
      >
        <Text style={styles.addButtonText}>+ Add Item to {space}</Text>
      </Pressable>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#e6f5e6" },
  title: { fontSize: 26, fontWeight: "600", marginBottom: 20 },
  itemBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemName: { fontSize: 18, fontWeight: "bold" },
  itemDate: { fontSize: 14, color: "#555" },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SpaceDetailScreen;
