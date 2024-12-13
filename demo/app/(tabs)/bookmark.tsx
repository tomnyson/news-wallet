import React from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";

export default function BookmarkScreen() {
  // Sample data for bookmarked articles
  const bookmarkedArticles = [
    {
      id: "1",
      title: "Politicians spoke into microphones after the meeting",
      category: "Politics",
      time: "5 min ago",
      image: require('../../assets/images/images-holder.png'),
    },
    {
      id: "2",
      title: "Politicians spoke into microphones after the meeting",
      category: "Politics",
      time: "5 min ago",
      image: require('../../assets/images/images-holder.png'),
    },
    {
      id: "3",
      title: "Politicians spoke into microphones after the meeting",
      category: "Politics",
      time: "5 min ago",
      image: require('../../assets/images/images-holder.png'),
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {/* Article Image */}
      <Image source={item.image} style={styles.image} />

      {/* Article Info */}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metadata}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.dot}> ● </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarkedArticles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    marginLeft: 10
  },
  time: {
    fontSize: 14,
    color: "#888",
    fontWeight: "bold",

  },
});
