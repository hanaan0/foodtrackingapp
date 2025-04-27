import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { auth } from "../UserOnboarding/FireBase";
import { MaterialIcons } from "@expo/vector-icons";
import Screen from "../layout/Screen";

// API setup
const API_KEY =
  "cc61e732442b2aec78fd0277d46fce71efb76959ab9accf84aa1f6775ccde770";
const NEWS_URL = `https://serpapi.com/search.json?q=food+waste+sustainability&tbm=nws&api_key=${API_KEY}`;

const HomeScreen = ({ navigation }) => {
  // State
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch news on mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(NEWS_URL);
        const data = await response.json();

        if (data.news_results) {
          setNews(data.news_results.slice(0, 4)); // Limit to 4 news articles
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Handle logout
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.replace("LoginScreen");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Handle navigation to other screens
  const handleNavigation = (route) => {
    navigation.navigate(route);
  };

  // Main view
  return (
    <Screen style={{ backgroundColor: "white" }}>
      {/* App title */}
      <Text style={styles.main}>EcoBite</Text>

      {/* Logout button */}
      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <MaterialIcons name="logout" size={24} color="#2f3030" />
      </TouchableOpacity>

      {/* News section */}
      <View style={styles.roundedContainer}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.sectionHeader}>
            Sustainability & Food Waste News
          </Text>

          {/* News articles */}
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <View style={styles.newsContainer}>
              {news.length > 0 ? (
                news.map((article, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.newsCard}
                    onPress={() =>
                      navigation.navigate("WebViewScreen", {
                        url: article.link,
                      })
                    }
                  >
                    <Image
                      source={{
                        uri:
                          article.thumbnail ||
                          "https://via.placeholder.com/150",
                      }}
                      style={styles.newsImage}
                    />
                    <View style={styles.newsTextContainer}>
                      <Text style={styles.newsTitle} numberOfLines={4}>
                        {article.title}
                      </Text>
                      <Text style={styles.newsSource}>{article.source}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noArticlesText}>
                  No relevant news found.
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Bottom navigation bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => handleNavigation("HomeScreen")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Home</Text>
        </Pressable>

        <Pressable
          onPress={() => handleNavigation("AddingScreen")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Add Item</Text>
        </Pressable>

        <Pressable
          onPress={() => handleNavigation("InventoryScreen")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>My Spaces</Text>
        </Pressable>

        <Pressable
          onPress={() => handleNavigation("TrackingScreen")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Track Item</Text>
        </Pressable>
      </View>
    </Screen>
  );
};

// Styles
const styles = StyleSheet.create({
  roundedContainer: {
    flex: 1,
    backgroundColor: "#a8e6a3",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    marginTop: 150,
  },
  main: {
    position: "absolute",
    top: 81,
    fontWeight: "500",
    fontSize: 24,
  },
  logoutButton: {
    position: "absolute",
    top: 80,
    left: 20,
    padding: 1,
    borderRadius: 8,
    zIndex: 10,
  },
  contentContainer: {
    paddingTop: 20,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 12,
    color: "#34495e",
  },
  newsCard: {
    width: 350,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    alignItems: "center",
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  newsTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    flexWrap: "wrap",
    width: "100%",
  },
  newsSource: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 5,
  },
  noArticlesText: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 10,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 90,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 16,
    color: "black",
  },
});

export default HomeScreen;
