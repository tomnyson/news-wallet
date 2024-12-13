import React, {useEffect, useState} from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import newService from '@/services/newService';
import { formatDistanceToNow } from "date-fns";
import { useRouter, useGlobalSearchParams } from "expo-router";
export default function ArticleScreen() {
  // Sample data for bookmarked articles
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {categoryId, tagId, keyword } = useGlobalSearchParams();

  const SERVER_STATIC = process.env.EXPO_PUBLIC_API_URL + '/storage'

  useEffect(() => {
    
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const query = {
          page: 1,
          limit: 100,
        }
        if(categoryId) {
          query.categoryId = categoryId;
        }
        if(tagId) {
          query.tagId = tagId;
        }
        if(keyword) {
          query.keyword = keyword;
        }

        const response = await newService.getPosts(query);
        if(response && response.data) {
            const fetchedArticles = response.data.map((article) => ({
                id: article.id,
                title: article.title,
                content: article.content,
                category: article.category.name,
                time: article.created_at 
              ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true }) 
              : "Just now",
                image: `${SERVER_STATIC}/${article.image}`, // Replace with actual image logic if applicable
              }));
              setArticles(fetchedArticles);
              setLoading(false)
        }
       
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    console.log('categoryId or tagId changed:', { categoryId, tagId });

    fetchArticles();
  }, [categoryId, tagId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}
    onPress={() => router.push(`/articles/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metadata}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.dot}> ● </Text>
          <Text style={styles.time}>{item?.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No articles available.</Text>
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
