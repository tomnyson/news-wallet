import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import newService from '@/services/newService';
import { useLocalSearchParams } from "expo-router";
import RenderHTML from "react-native-render-html";

export default function ArticleDetailScreen({ route }) {
  const { id } = useLocalSearchParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { width } = Dimensions.get("window");
  const contentWidth = width - 32; // Account for padding

  const SERVER_STATIC = process.env.EXPO_PUBLIC_API_URL + '/storage'
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await newService.getPostDetail(id);
        console.log(response.data);
        setArticle(response);
      } catch (err) {
        setError("Failed to fetch article details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.category}>{article?.category?.name || "Unknown"}</Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.date}>
          {new Date(article.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Image */}
      <Image
        source={{
          uri: `${SERVER_STATIC}/${article.image}` || "https://via.placeholder.com/600x300", // Fallback image
        }}
        style={styles.image}
      />

      {/* Content */}
      <View style={styles.content}>
      <RenderHTML
          contentWidth={contentWidth}
          source={{ html: article.content || "<p>No content available</p>" }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
  content: {
    paddingBottom: 16,
  },
  text: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
  },
});