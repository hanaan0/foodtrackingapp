import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Screen from "../layout/Screen";
import { auth } from "../UserOnboarding/FireBase"; // Imports  initialised auth
import { ScrollView } from "react-native";
const ResisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration = async () => {
    try {
      // Sign Up logic
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("HomeScreen"); // Navigates to HomeScreen on successful registration
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Screen style={styles.authContainer}>
          <Image
            source={require("../data/RegImage.png")}
            style={styles.image}
          />

          {/* Title positioned at the top */}
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Sign Up</Text>
          </View>

          {/* Input fields and button */}
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <Button
            title="Sign Up"
            onPress={handleRegistration}
            color="#3498db"
          />
        </Screen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1, // Ensure the container takes up the full screen
    justifyContent: "center", // Center inputs and button vertically
    alignItems: "center", // Center horizontally
    padding: 16,
    backgroundColor: "#e9f5e9",
  },
  titleWrapper: {
    padding: 50,
    position: "absolute", // Position the title at the top
    top: 50, // Adjust the vertical position
    width: "100%", // Take full width
    alignItems: "center", // Center the title horizontally
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    width: "100%",
    maxWidth: 300, // Restrict the input width
    borderColor: "#cfcdcc",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  image: {
    marginTop: 15,
    marginBottom: 50,
    width: 300,
    height: 250,
    resizeMode: "contain", // Ensures the image scales proportionally
  },
});

export default ResisterScreen;
