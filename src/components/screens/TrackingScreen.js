import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { Screen } from "react-native-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItemsContext } from "../data/ItemsContext";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const TrackingScreen = () => {
  const { items, setItems, userId } = useContext(ItemsContext);
  const [foodSavedKg, setFoodSavedKg] = useState(0);
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      loadUserSavedProgress();
    }
  }, [userId]);

  const loadUserSavedProgress = async () => {
    if (!userId) return;
    try {
      const savedKg = await AsyncStorage.getItem(`foodSavedKg-${userId}`);
      const savedHistory = await AsyncStorage.getItem(`history-${userId}`);

      if (savedKg !== null) {
        setFoodSavedKg(parseFloat(savedKg));
      } else {
        setFoodSavedKg(0);
      }

      if (savedHistory !== null) {
        setHistory(JSON.parse(savedHistory));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Error retrieving progress or history:", error);
    }
  };

  const removeExpiredItems = async () => {
    if (!userId) return;
    const today = new Date();
    const expiredItems = items.filter((item) => new Date(item.date) < today);
    const filteredItems = items.filter((item) => new Date(item.date) >= today);

    if (expiredItems.length > 0) {
      setItems(filteredItems);
      try {
        await AsyncStorage.setItem(
          `items-${userId}`,
          JSON.stringify(filteredItems)
        );
      } catch (error) {
        console.error("Error saving filtered items:", error);
      }

      const totalExpiredWeight = expiredItems.length * 2;

      let newKg = foodSavedKg + totalExpiredWeight;

      if (newKg >= 10) {
        //  Save to history
        const today = new Date();
        const dateStr = today.toDateString();
        const newHistory = [...history, { date: dateStr, amount: "10kg" }];
        await AsyncStorage.setItem(
          `history-${userId}`,
          JSON.stringify(newHistory)
        );
        setHistory(newHistory);

        newKg = 0; // Reset
      }

      setFoodSavedKg(newKg);
      await AsyncStorage.setItem(`foodSavedKg-${userId}`, newKg.toString());

      if (newKg === 0) {
        // Show toast
        Toast.show({
          type: "success",
          text1: "Congratulations!",
          text2: "You've saved 10kg of food! 🎉",
          position: "top",
        });
      }
    }
  };

  {
    /* DELETE BUTTON */
  }
  const removeItem = async (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    await AsyncStorage.setItem(`items-${userId}`, JSON.stringify(updatedItems));
  };

  const renderRightActions = (index) => (
    <View style={styles.deleteContainer}>
      <Button title="Delete" color="white" onPress={() => removeItem(index)} />
    </View>
  );

  {
    /* EXPIRY COLOUR INDICATOR */
  }
  const getBackgroundColor = (expiryDateStr) => {
    const expiryDate = new Date(expiryDateStr);
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 5) return "#a5d6a7"; // green
    if (diffDays <= 3 && diffDays > 1) return "#ffcc80"; // orange
    if (diffDays <= 1) return "#ef9a9a"; // red
    return "white";
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Screen style={{ flex: 1, backgroundColor: "#9bac6b" }}>
        {/* HEADER */}
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Image
              source={require("../data/imgtrack.png")}
              style={styles.headerImage}
            />
            <Text style={styles.heading}>EcoTrack</Text>
          </View>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("HistoryScreen")}
          >
            <Image
              source={require("../data/History.png")}
              style={styles.historyImage}
            />
          </TouchableOpacity>
        </View>

        {/* PROGRESS + LIST */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={320}
              width={10}
              fill={(foodSavedKg / 10) * 100}
              tintColor="#4CAF50"
              backgroundColor="#e0e0e0"
            />
            <Text style={styles.progressText}>
              {foodSavedKg.toFixed(1)}kg Saved
            </Text>
          </View>

          <Button title="Remove Expired Items" onPress={removeExpiredItems} />

          {/* ITEMS LIST */}
          {items.length > 0 ? (
            items.map((item, index) => (
              <Swipeable
                key={index}
                renderRightActions={() => renderRightActions(index)}
              >
                <View
                  style={[
                    styles.itemContainer,
                    { backgroundColor: getBackgroundColor(item.date) },
                  ]}
                >
                  <View style={styles.rowContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.pipe}>|</Text>
                  </View>
                  <Text style={styles.itemDate}>
                    Expiry Date: {new Date(item.date).toDateString()}
                  </Text>
                </View>
              </Swipeable>
            ))
          ) : (
            <Text>No items to track</Text>
          )}
        </ScrollView>
      </Screen>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerImage: {
    width: 55,
    height: 55,
    marginRight: 8,
  },
  heading: {
    fontSize: 40,
    fontWeight: "200",
    color: "white",
  },
  historyButton: {
    marginTop: 25,
    left: 125,
  },
  historyImage: {
    width: 40,
    height: 40,
  },
  progressContainer: {
    marginTop: 15,
    marginBottom: 30,
    alignItems: "center",
  },
  progressText: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "580",
    top: 140,
    left: 128,
    color: "white",
  },
  itemContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    marginTop: 20,
    width: 350,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  pipe: {
    marginHorizontal: 6,
    color: "#999",
    fontSize: 16,
  },
  itemDate: {
    fontSize: 14,
    color: "#666",
  },
  deleteContainer: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 8,
  },
});

export default TrackingScreen;
