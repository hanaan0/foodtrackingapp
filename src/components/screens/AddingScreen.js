import React, { useState, useContext, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  Alert,
  Switch,
  Pressable,
  Keyboard,
} from "react-native";
import { Screen } from "react-native-screens";
import { ItemsContext } from "../data/ItemsContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddingScreen = ({ navigation }) => {
  // Context and states
  const { items, setItems } = useContext(ItemsContext);
  const { userId } = useContext(ItemsContext);
  const route = useRoute();

  const [spaces, setSpaces] = useState([]);
  const [showSpaceList, setShowSpaceList] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(
    route.params?.space || "General"
  );

  const [itemName, setItemName] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isBarcode, setIsBarcode] = useState(false);
  const [customNotifyDays, setCustomNotifyDays] = useState("");

  // Load spaces from storage
  useEffect(() => {
    const loadSpaces = async () => {
      try {
        const saved = await AsyncStorage.getItem(`spaces-${userId}`);
        if (saved) {
          setSpaces(JSON.parse(saved));
        } else {
          setSpaces(["Fridge", "Freezer", "Pantry"]);
        }
      } catch (err) {
        console.error("Error loading spaces:", err);
      }
    };

    loadSpaces();
  }, []);

  // Handle adding an item
  const handleAddItem = async () => {
    if (!itemName) {
      Alert.alert("Error", "Please enter an item name.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(expiryDate);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      Alert.alert("Invalid Date", "Expiry date cannot be in the past.");
      return;
    }

    const newItem = {
      name: itemName,
      date: expiryDate.toISOString(),
      notifyDays: customNotifyDays ? parseInt(customNotifyDays) : null,
      space: selectedSpace,
    };

    setItems([...items, newItem]);

    console.log(
      `📦 Added "${itemName}" with expiry on: ${expiryDate.toString()}`
    );
    await scheduleNotification(itemName, expiryDate, customNotifyDays);

    navigation.navigate("TrackingScreen");
    setItemName("");
    setExpiryDate(new Date());
    setCustomNotifyDays("");
  };

  // Schedule notification reminders
  const scheduleNotification = async (itemName, expiryDate, customDays) => {
    const now = new Date();

    const oneDayTrigger = new Date(expiryDate);
    oneDayTrigger.setDate(oneDayTrigger.getDate() - 1);
    oneDayTrigger.setHours(9, 0, 0);

    if (oneDayTrigger > now) {
      console.log(
        `🕒 [Scheduled] "${itemName}" notification for: ${oneDayTrigger}`
      );
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Food Expiry Reminder",
          body: `Your ${itemName} is expiring tomorrow! Use it before it's wasted.`,
          sound: "default",
        },
        trigger: { date: oneDayTrigger },
      });
    }

    const customDaysInt = parseInt(customDays);
    if (!isNaN(customDaysInt) && customDaysInt > 1) {
      const customTrigger = new Date(expiryDate);
      customTrigger.setDate(customTrigger.getDate() - customDaysInt);
      customTrigger.setHours(9, 0, 0);

      if (customTrigger > now) {
        console.log(
          `🕒 [Custom Scheduled] "${itemName}" notification in ${customDaysInt} days: ${customTrigger}`
        );
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Food Expiry Reminder",
            body: `Reminder for: ${itemName} will be sent in ${customDaysInt} day(s) before expiry`,
            sound: "default",
          },
          trigger: { date: customTrigger },
        });
      }
    }
  };

  // Handle barcode toggle
  const handleToggle = (value) => {
    setIsBarcode(value);
    if (value) {
      navigation.navigate("BarcodeScanner");
    }
  };

  // Main view
  return (
    <Screen style={{ flex: 1, backgroundColor: "#6db577" }}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>EcoAdd</Text>

        {/* Manual add / barcode toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Manually add</Text>
          <Switch
            value={isBarcode}
            onValueChange={handleToggle}
            trackColor={{ false: "#ccc", true: "white" }}
            thumbColor={isBarcode ? "black" : "white"}
          />
          <Text style={styles.toggleText}>Barcode add</Text>
        </View>

        {/* Manual add form */}
        {!isBarcode && (
          <View>
            {/* Space selection */}
            <Pressable onPress={() => setShowSpaceList(!showSpaceList)}>
              <Text
                style={[styles.spaceText, { textDecorationLine: "underline" }]}
              >
                Adding to: {selectedSpace} ⌄
              </Text>
            </Pressable>

            {showSpaceList && (
              <View style={styles.spaceSelector}>
                {spaces.map((space, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setSelectedSpace(space);
                      setShowSpaceList(false);
                    }}
                    style={styles.spaceOption}
                  >
                    <Text>{space}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Item name input */}
            <TextInput
              style={styles.input}
              placeholder="Enter Item Name"
              value={itemName}
              onChangeText={setItemName}
            />

            {/* Custom notify days input */}
            <TextInput
              style={styles.input}
              placeholder="Notify me when (Custom)"
              keyboardType="numeric"
              returnKeyType="done"
              value={customNotifyDays}
              onChangeText={(text) =>
                setCustomNotifyDays(text.replace(/[^0-9]/g, ""))
              }
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            {/* Expiry date picker button */}
            <Pressable
              style={styles.button}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.buttonText}>Set Expiry Date</Text>
            </Pressable>

            {/* Expiry date picker */}
            {showDatePicker && (
              <DateTimePicker
                value={expiryDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setExpiryDate(selectedDate);
                }}
              />
            )}

            {/* Add item button */}
            <Pressable style={styles.button} onPress={handleAddItem}>
              <Text style={styles.buttonText}>Add Item</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Screen>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 40,
    color: "white",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  toggleText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: "white",
  },
  spaceText: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  spaceSelector: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: 300,
    alignSelf: "center",
  },
  spaceOption: {
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
    width: 300,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 30,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddingScreen;
