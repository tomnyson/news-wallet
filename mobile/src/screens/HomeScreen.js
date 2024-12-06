import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
// import Carousel, {
// } from 'react-native-reanimated-carousel';
import Pagination from '../components/Pagination';


const { width: screenWidth } = Dimensions.get('window');
 
const defaultDataWith6Colors = [
	"#B0604D",
	"#899F9C",
	"#B3C680",
	"#5C6265",
	"#F5D399",
	"#F1F1F1",
];

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);

  const data = [
    {
      title: 'All the events of the LA Lakers vs Houston Rockets game',
      category: 'Sport',
      reads: '2.4 K Reads',
      time: '2min ago',
      image: require('../assets/images-holder.png'),
    },
    {
      title: 'Breaking: The latest updates on the global summit',
      category: 'Politics',
      reads: '5K Reads',
      time: '5min ago',
      image: require('../assets/images-holder.png'),
    },
  ];

  const onPressPagination = (index) => {
    setProgress(index);
  };


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.newImage} />
      {/* News Info */}
      <View style={styles.newsInfo}>
        <Text style={styles.newCategory}>
          ● {item.category} News
        </Text>
        <Text style={styles.newTitle}>{item.title}</Text>
        <Text style={styles.newMeta}>
          {item.newCategory} ● {item.time}
        </Text>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      {/* Featured News Carousel */}
      {/* <Carousel
        loop
        width={screenWidth} // Full screen width
        height={250} // Adjust height as needed
        autoPlay={true}
        autoPlayInterval={3000}
        scrollAnimationDuration={1000}
        onProgressChange={(currentIndex) => setProgress(currentIndex)}
        data={data}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.metadata}>
                <Text style={styles.metadataText}>{item.category}</Text>
                <Text style={styles.metadataText}>•</Text>
                <Text style={styles.metadataText}>{item.reads}</Text>
                <Text style={styles.metadataText}>•</Text>
                <Text style={styles.metadataText}>{item.time}</Text>
              </View>
            </View>
          </View>
        )}
      /> */}
       <Pagination
        progress={progress}
        data={data}
        dotStyle={{
          width: 25,
          height: 4,
          backgroundColor: "#262626",
        }}
        activeDotStyle={{
          backgroundColor: "#f1f1f1",
        }}
        containerStyle={{
          gap: 10,
          marginBottom: 10,
        }}
        horizontal
        onPress={onPressPagination}
      />
       <View style={styles.container}>
      {/* All Today's News Section */}
      <Text style={styles.sectionTitle}>All Today's News</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
        renderItem={renderItem}
      />
      </View>
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Featured Carousel
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    title: {
      position: 'absolute',
      bottom: 20,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 10,
      borderRadius: 5,
    },
  infoText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 8,
  },
  // Today's News
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  flatList: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    width: screenWidth * 0.8,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  newsInfo: {
    flex: 1,
    padding: 8,
  },
  newsCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  newsTime: {
    fontSize: 12,
    color: '#888',
  },
  carouselItem: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
  },
  category: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 8,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  paginationInactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginHorizontal: 4,
  },

   newInfo: {
    flex: 1,
    padding: 8,
  },
  newCategory: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
    marginBottom: 4,
  },
  newTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  newMeta: {
    fontSize: 12,
    color: "#888",
  },
  newImage: {
    width: 200,
    height: '100%',
    resizeMode: "cover",
  },
});
