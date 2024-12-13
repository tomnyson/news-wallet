import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
const { width: screenWidth } = Dimensions.get('window')
import newService from '@/services/newService'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
export default function CategoriesScreen() {
  // Data for popular tags and categories
  const [tags, setTags] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const query = {
      page: 1,
      limit: 100,
    }
    const response = await newService.getCategories(query)
    if (response && response.data) {
      setCategories(response.data)
    }

    const responseTags = await newService.getTags(query)
    if (responseTags && responseTags.data) {
      setTags(responseTags.data)
    }
    setLoading(false)
  }

  console.log('tags', tags)

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  const handleSearch = () => {
    router.push(`/articles?keyword=${keyword}`)
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#ccc" />
        <TextInput placeholder="Search" placeholderTextColor="#ccc" style={styles.searchInput}
           onChangeText={setKeyword}
           onSubmitEditing={handleSearch}

        />
      </View>

      <Text style={styles.sectionTitle}>Tag</Text>
      <FlatList
        data={tags || []}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tag}
            onPress={() => router.push(`/articles?tagId=${item.id}`)}
          >
            <Text style={styles.tagText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={categories || []}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item, index }) => {
          const rowIndex = Math.floor(index / 2)
          const isEvenRow = rowIndex % 2 === 0
          const isEvenColumn = index % 2 === 0

          const backgroundColor =
            (isEvenRow && isEvenColumn) || (!isEvenRow && !isEvenColumn) ? '#013BAE' : '#011E86'

          return (
            <TouchableOpacity
              style={[styles.categoryBox, { backgroundColor }]}
              onPress={() => router.push(`/articles?categoryId=${item.id}`)}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#003366',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 16
  },
  tagsContainer: {
    paddingHorizontal: 5,
  },
  tag: {
    backgroundColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    fontWeight: 'bold',
    height: 32,
  },
  tagText: {
    fontSize: 12,
    color: '#000',
    textTransform: 'lowercase',
  },
  categoriesContainer: {
    justifyContent: 'flex-start',
    paddingVertical: 20,
  },
  categoryBox: {
    backgroundColor: '#003366',
    flex: 1,
    height: 100,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
})
