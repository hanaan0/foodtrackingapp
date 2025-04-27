import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const WebViewScreen = ({ route }) => {
  // Get URL from route params
  const { url } = route.params;

  // Main view
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color="#007bff" />}
      />
    </View>
  );
};
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewScreen;
