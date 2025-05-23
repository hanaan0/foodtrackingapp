import React, { useEffect } from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Screen from "../layout/Screen";

const WelcomeScreen = ({ navigation }) => {
  // Shared values for animation
  const ring1Padding = useSharedValue(0);
  const ring2Padding = useSharedValue(0);

  // Animated styles
  const animatedStyle1 = useAnimatedStyle(() => ({
    padding: ring1Padding.value,
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    padding: ring2Padding.value,
  }));

  // Animation effect
  useEffect(() => {
    ring1Padding.value = withSpring(30, { damping: 10 });
    ring2Padding.value = withSpring(50, { damping: 10 });

    // Navigate to the next screen after the animation
    const timer = setTimeout(() => {
      navigation.navigate("BoardingScreen");
    }, 1550);

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigation]);

  return (
    <Screen>
      {/* Rings around the image */}
      <Animated.View style={[styles.ring, animatedStyle2]}>
        <Animated.View style={[styles.ring, animatedStyle1]}>
          <Image source={require("../data/Logo.png")} style={styles.image} />
        </Animated.View>
      </Animated.View>

      {/* Title and punchline */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to EcoBite!</Text>
        <Text style={styles.subtitle}>Fresh Today, Sustainable Tomorrow.</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  ring: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white
    borderRadius: 200, // Circular shape
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 180,
    height: 180,
  },
  textContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WelcomeScreen;
