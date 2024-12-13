import React, {useEffect, useState} from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import newService from '@/services/newService';
import { formatDistanceToNow } from "date-fns";
import { useRouter, useGlobalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {checkTokenValidity} from '@/services/auth';
import { IMAGE_URL } from "@/utils/constants";

export default function BookmarkScreen() {
  // Sample data for bookmarked articles
  const [bookmarks, setBookmark] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkAuth();
      fetchBookMarkData();
    });

    return unsubscribe;
  }, [navigation]);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const isValid = await checkTokenValidity();
          if (isValid && isValid.status == 401) {
            console.warn('Invalid token. Redirecting to login.');
            router.push('/login');
          }
        } catch (err) {
          console.error('Error checking token validity:', err);
        }
        
      }else {
        console.warn('No token found. Redirecting to login.');
        router.push('/login');
      }
    } catch (error) {
      console.error('Authentication check error:', error);
    }
  };

  const fetchBookMarkData = async () => {
    try {
      setLoading(true)
      const response = await newService.getBookmarks()
      setBookmark(response)
    } catch (error) {
      console.error('Error fetching user data:', error)
      Alert.alert('Error', 'Failed to fetch user data.')
    } finally {
      setLoading(false)
    }
  }

  const renderItem = ({ item: {post} }) => {
    const image = `${IMAGE_URL}/${post.image}`
    return (
      <TouchableOpacity style={styles.card}
    onPress={() => router.push(`/articles/${post.id}`)}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.metadata}>
          <Text style={styles.category}>{post?.category?.name}</Text>
          <Text style={styles.dot}> ● </Text>
          <Text style={styles.time}>{post.created_at 
              ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) 
              : "Just now"}</Text>
        </View>
      </View>
    </TouchableOpacity>
    )
  }


  if(loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookmarks available.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff5a5f",
  },
  dot: {
    fontSize: 14,
    color: "#888",
  },
  time: {
    fontSize: 14,
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});
