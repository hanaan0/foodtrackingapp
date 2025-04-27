import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SignUpButton = ({ label }) => {
  const navigation = useNavigation(); // Access navigation object

  const handlePress = () => {
    navigation.navigate("ResisterScreen"); // Navigate to the Register Screen
  };

  return (
    <Pressable onPress={handlePress} style={styles.SignUpButton}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  SignUpButton: {
    height: 55,
    width: 300,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 80,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#559426",
  },
});

export default SignUpButton;
