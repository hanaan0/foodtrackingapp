import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import Screen from "../layout/Screen";
import SignUpButton from "../../UI/SignUpButton";

const BoardingScreen = ({ navigation }) => {
  return (
    <Screen style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Let's Get Started!</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require("../data/download.png")}
            style={styles.image}
          />
        </View>
      </View>
      <View style={styles.roundedContainer}>
        <SignUpButton label="Sign Up" />
        <Text style={styles.subContainer}>
          Already have an account?{" "}
          <Pressable onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={[styles.subContainer, styles.loginText]}>Log in</Text>
          </Pressable>
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up the full screen
    justifyContent: "flex-start", // Start content from the top
    alignItems: "center", // Center content horizontally
  },
  headerContainer: {
    marginTop: 80, // Space from the top of the screen
    marginBottom: 20, // Space between the text and the image
  },
  imageContainer: {
    marginBottom: 20, // Space between the image and additional content
  },
  contentContainer: {
    width: "100%", //  full width for additional content
    paddingHorizontal: 20, // Add padding for the content
    alignItems: "center", // Center additional content horizontally
  },
  subContainer: {
    marginTop: 5,
    fontWeight: "330",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  image: {
    width: 300,
    height: 250,
    resizeMode: "contain", // Ensures the image scales proportionally
  },
  contentText: {
    fontSize: 16,
    color: "gray",
  },
  roundedContainer: {
    flex: 1,
    backgroundColor: "#6dbb35",
    width: "100%",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 30,
    alignItems: "center",
    marginTop: 40, // Adjusts the spacing between the header and rounded container
  },
  loginText: {
    color: "blue",
    fontWeight: "bold",
  },
});

export default BoardingScreen;
