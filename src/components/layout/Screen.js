import { StyleSheet, View, StatusBar } from "react-native";

const Screen = ({ children }) => {
  // Initialisations ---------------------
  // State -------------------------------
  // Handlers ----------------------------
  // View --------------------------------
  return (
    <View style={styles.screen}>
      {children}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFA500",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Screen;
