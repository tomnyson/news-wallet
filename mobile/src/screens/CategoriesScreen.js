import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: screenWidth } = Dimensions.get("window");

export default function CategoriesScreen() {
  // Data for popular tags and categories
  const tags = [
    "#daily",
    "#music",
    "#politics",
    "#arts",
    "#party",
    "#world",
    "#health",
    "#day",
  ];

  const categories = [
    { id: "1", name: "Thế giới" },
    { id: "2", name: "Mới" },
    { id: "3", name: "Bóng đá VN" },
    { id: "4", name: "Bóng đá QT" },
    { id: "5", name: "Độc & Lạ" },
    { id: "6", name: "Tình yêu" },
    { id: "7", name: "Giải trí" },
    { id: "8", name: "Nóng" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#ccc"
          style={styles.searchInput}
        />
      </View>

      {/* Popular Tags */}
      <Text style={styles.sectionTitle}>Thẻ phổ biến</Text>
      <FlatList
        data={tags}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Categories Grid */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryBox}>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: "#003366",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tagsContainer: {
    paddingHorizontal: 5,
  },
  tag: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    height: 32,
    backgroundColor: "#C2C2C2",
  },
  tagText: {
    fontSize: 12,
    color: "#555",
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryBox: {
    backgroundColor: "#003366",
    flex: 1,
    height: 100,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
