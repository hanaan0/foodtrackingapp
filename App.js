import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./src/components/UserOnboarding/WelcomeScreen";
import BoardingScreen from "./src/components/UserOnboarding/BoardingScreen";
import HomeScreen from "./src/components/screens/HomeScreen";
import TrackingScreen from "./src/components/screens/TrackingScreen";
import AddingScreen from "./src/components/screens/AddingScreen";
import ResisterScreen from "./src/components/UserOnboarding/RegisterScreen";
import LoginScreen from "./src/components/UserOnboarding/LoginScreen";
import { ItemsProvider } from "./src/components/data/ItemsContext";
import WebViewScreen from "./src/components/screens/WebViewScreen";
import BarcodeScanner from "./src/components/screens/BarcodeScreen";
import InventoryScreen from "./src/components/screens/InventoryScreen";
import SpaceDetailScreen from "./src/components/screens/SpaceDetailScreen";
import HistoryScreen from "./src/components/screens/HistoryScreen";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import React, { useEffect } from "react";
import { Alert } from "react-native";

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Enable notifications in settings.");
      }
    };

    requestPermissions();
  }, []);

  return (
    <ItemsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen">
          {/* Welcome Screen */}
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* Boarding Screen */}
          <Stack.Screen
            name="BoardingScreen"
            component={BoardingScreen}
            options={{
              title: "Onboarding",
              headerShown: false,
            }}
          />
          {/* Home Screen */}
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
              title: "Home",
            }}
          />
          {/* Inventory Screen */}
          <Stack.Screen
            name="InventoryScreen"
            component={InventoryScreen}
            options={{
              headerStyle: { backgroundColor: "#c7e3c1" },
              headerShown: true,
              headerBackVisible: true,
              headerTitle: "Your Spaces",
              headerTintColor: "#000",
            }}
          />
          {/* Space Detail Screen */}
          <Stack.Screen
            name="SpaceDetailScreen"
            component={SpaceDetailScreen}
            options={({ route }) => ({
              headerStyle: { backgroundColor: "#e6f5e6" },
              headerShown: true,
              headerBackVisible: true,
              headerTitle: route.params?.space || "Space Details",
              headerTintColor: "#000",
            })}
          />
          {/* Tracking Screen */}
          <Stack.Screen
            name="TrackingScreen"
            component={TrackingScreen}
            options={{
              headerStyle: { backgroundColor: "#9bac6b" },
              headerShown: true,
              headerBackVisible: true,
              headerTitle: "",
              headerTintColor: "#000",
            }}
          />
          {/* Adding Screen */}
          <Stack.Screen
            name="AddingScreen"
            component={AddingScreen}
            options={{
              headerStyle: { backgroundColor: "#6db577" },
              headerShown: true,
              headerBackVisible: true,
              headerTitle: "",
              headerTintColor: "#000",
            }}
          />
          {/* Login Screen */}
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerStyle: { backgroundColor: "#7fd770" },
              headerShown: true,
              headerBackVisible: true,
              headerTitle: "",
              headerTintColor: "#000",
            }}
          />
          {/* Register Screen */}
          <Stack.Screen
            name="ResisterScreen"
            component={ResisterScreen}
            options={{
              headerStyle: { backgroundColor: "#e9f5e9" },
              headerShown: true,
              headerBackVisible: true,
              headerTitle: "",
              headerTintColor: "#000",
            }}
          />
          {/* WebView Screen */}
          <Stack.Screen
            name="WebViewScreen"
            component={WebViewScreen}
            options={{ title: "News Article" }}
          />
          {/* Barcode Scanner */}
          <Stack.Screen
            name="BarcodeScanner"
            component={BarcodeScanner}
            options={{
              title: "Barcode Scanner",
            }}
          />
          {/* History Screen */}
          <Stack.Screen
            name="HistoryScreen"
            component={HistoryScreen}
            options={{
              title: "History",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <Toast />
    </ItemsProvider>
  );
};

export default App;
