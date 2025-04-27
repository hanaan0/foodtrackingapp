import { StyleSheet, View, StatusBar } from "react-native";

const Screen = ({ children, style }) => {
  return (
    <View style={[styles.screen, style]}>
      {children}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#8EB486",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Screen;
