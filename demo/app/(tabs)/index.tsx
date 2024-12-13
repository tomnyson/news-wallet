import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import newService from '@/services/newService'
import { formatDistanceToNow } from "date-fns";
import { useNavigation } from 'expo-router'
import CarouselCustom from '@/components/CarouselCustom'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function HomeScreen() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
   const SERVER_STATIC = process.env.EXPO_PUBLIC_API_URL + '/storage'
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reload data when screen comes into focus
      console.log('HomeScreen focused')
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);


  const fetchData = async () => {
    setLoading(true)
    try {
      // setSlider
      const query = {
        page: 1,
        limit: 10,
        sort: 'desc',
      }
      const response = await newService.getPosts(query)
      console.log('response:', response)
      if(response && response.data) {
        const fetchedArticles = response.data.map((article) => ({
            id: article.id,
            title: article.title,
            content: article.content,
            type: article.type,
            category: article.category.name,
            time: article.created_at 
          ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true }) 
          : "Just now",
            image: `${SERVER_STATIC}/${article.image}`, // Replace with actual image logic if applicable
          }));
          console.log('fetchedArticles', fetchedArticles)
          setPosts(fetchedArticles);
          setLoading(false)
    }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: 'https://cdnmedia.baotintuc.vn/Upload/DmtgOUlHWBO5POIHzIwr1A/files/2024/12/11/Syria-11122024-03.jpg',
        }}
        style={[styles.newImage, styles.imageStyle]}
      />
      <View style={styles.newsInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.new_dot}>•</Text>
          <Text style={styles.new_category}>Media News</Text>
        </View>
        <Text style={styles.newTitle}>{item.title}</Text>
        <View  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.newMeta}>
            {item.category}
          </Text>
          <Text style={styles.newMeta}>
          ● {item.time}
        </Text>
        </View>
       
      </View>
    </View>
  )

  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }


  const newPost = posts.filter(post => post.type == 'free').splice(0, 5) || 5
  const newPremium = posts.filter(post => post.type == 'paid').splice(0, 5) || 5
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <CarouselCustom posts={posts}/>
      </View>
      <View style={styles.footer}>
        {/* All Today's News Section */}
        <Text style={styles.sectionTitle}>All Today's News</Text>
        <FlatList
          data={newPost}
          keyExtractor={(item) => item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No articles available.</Text>
            </View>
          )}
        />
      <Text style={styles.sectionTitle}>Premium News</Text>
        <FlatList
          data={newPremium}
          keyExtractor={(item) => item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No articles available.</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screenHeight,
    backgroundColor: '#fafafa',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  // Today's News
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  flatList: {
  },

  carousel: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.5,
    marginLeft: screenWidth * 0.02,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.3,
    borderRadius: 10,
  },
  carouselItem: {
    width: '100%',
    borderRadius: 10,
  },
  imageStyle: {
    borderRadius: 10, // Ensures the image corners are rounded
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Transparent black overlay
    padding: 15,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 50,
  },
  // list news
  newImage: {
    width: '60%',
    height: 200, // Adjust as per your need
    justifyContent: 'flex-end',
  },
  newsInfo: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  newCategory: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  dot: {
    color: '#00008B', // Blue color for the dot
    fontSize: 18,
  },
  newTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    lineHeight: 24,
    marginBottom: 6,
    maxWidth: screenWidth / 2.5,
  },
  newMeta: {
    fontSize: 12,
    color: '#D3D3D3', // Light gray for metadata
  },
  new_dot: {
    width: 10,
    height: 10,
    backgroundColor: '#001148',
    borderRadius: 5,
    marginRight: 8,
  },
  new_category: {
    fontSize: 14,
    width: 40,
    fontWeight: 'bold',
    color: '#BABABA',
  },
  card: {
    borderRadius: 10,
    flexDirection: 'row',
    maxWidth: (Dimensions.get('window').width - 32) / 1.2,
    marginRight: 20
  },
  new_metadataText: {
    color: '#BABABA',
    fontSize: 12,
    marginHorizontal: 5,
  },
  footer: {
    flex: 3,
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
})
