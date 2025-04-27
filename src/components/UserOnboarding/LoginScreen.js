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
  ScrollView,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import Screen from "../layout/Screen";
import { auth } from "../UserOnboarding/FireBase"; // Imports  initialised auth

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("HomeScreen");
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
        <Screen style={{ backgroundColor: "white" }}>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../data/Login2.png")}
                style={styles.image}
              />
            </View>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Login</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Log In" onPress={handleLogin} color="#3498db" />
            </View>
          </View>

          {/* Input fields for Email and Password */}
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
        </Screen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 415,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  imageContainer: {
    marginBottom: -250,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  image: {
    height: 480,
    width: 420,
    resizeMode: "stretch",
  },
  input: {
    height: 50,
    width: "100%",
    maxWidth: 300,
    borderColor: "#cfcdcc",
    borderWidth: 1,
    marginTop: -200,
    marginBottom: 225,
    padding: 8,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
});

export default LoginScreen;
