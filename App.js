import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./src/components/screens/WelcomeScreen";
import Home from "./src/components/screens/HomeScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        {/* Welcome Screen */}
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            title: "Welcome",
            headerShown: false, // Hide the header for a cleaner welcome screen
          }}
        />

        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Home",
            headerStyle: { backgroundColor: "#FFA500" }, // Matches the WelcomeScreen style
            headerTintColor: "#FFF", // White text for header
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
