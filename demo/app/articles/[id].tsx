import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import newService from '@/services/newService';
import { router, useLocalSearchParams } from "expo-router";
import RenderHTML from "react-native-render-html";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTokenValidity } from '@/services/auth';
import { Colors } from '@/constants/Colors';
import { Toast } from "react-native-toast-message";

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { width } = Dimensions.get("window");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const contentWidth = width - 32; 

  const SERVER_STATIC = process.env.EXPO_PUBLIC_API_URL + '/storage'
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await newService.getPostDetail(id);
        setArticle(response);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch article. Please try again.",
        })
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const isValid = await checkTokenValidity();
          if (isValid && isValid.status == 401) {
            console.warn('Invalid token. Redirecting to login.');
            return;
          }
          setIsAuthenticated(true);

        } catch (err) {
          console.error('Error checking token validity:', err);
        }
        
      }else {
        console.warn('No token found. Redirecting to login.');
      }
    } catch (error) {
      console.error('Authentication check error:', error);
    }
  };


  const handleBookmark = async () => {
    if (isAuthenticated) {
      try {
        if (article.isBookmarked) {
          // Remove bookmark
          alert('remove bookmark')
          await newService.removeBookmark(article.bookmarkId);
          setArticle({
            ...article,
            isBookmarked: false
          });
          Toast.show({
            type: "success",
            text1: "Bookmark Removed",
            text2: "The article has been removed from your bookmarks.",
          });
        } else {
          // Add bookmark
          await newService.createBookmark({post_id: article.id});
          setArticle({
            ...article,
            isBookmarked: true
          });
          Toast.show({
            type: "success",
            text1: "Bookmarked",
            text2: "The article has been added to your bookmarks.",
          });
        }
      } catch (error) {
        console.error("Error updating bookmark:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to update bookmark. Please try again.",
        });
      }
    } else {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#003366" />
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
      <View style={[styles.header, styles.flexContainer]}>
        <View >
          <Text style={styles.category}>{article?.category?.name || "Unknown"}</Text>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.date}>
            {new Date(article.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={{paddingRight : 0}}>
          <TouchableOpacity
            onPress={handleBookmark}
          >
              <MaterialIcons name={article.isBookmarked ? 'bookmark': 'bookmark-border'} size={24} color="#003366" />
          </TouchableOpacity>
        </View>
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
  flexContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: 14,
    color: Colors.light.secondary,
    marginBottom: 4,
    textTransform: 'capitalize'
    
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.secondary,
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
    color: Colors.light.secondary,
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
    color: Colors.light.error,
  },
});