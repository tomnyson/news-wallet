import React, { useState, useCallback, useRef } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import Pagination from './Pagination';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CarouselCustom({ posts }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // Memoized function for handling pagination press
  const onPressPagination = useCallback((index: number) => {
    setCurrentIndex(index);
    carouselRef.current?.scrollTo({ index, animated: true });
  }, []);

  // Memoized function for rendering carousel items
  const renderCarouselItem = useCallback(({ item }) => (
    <View style={styles.carouselItem}>
      <ImageBackground
        source={{ uri: `${item.image}` }}
        style={styles.image}
      >
        <View style={styles.overlay}>
          <View style={styles.carouselItemWrapper}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.metadataContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.carousel_dot}>•</Text>
                <Text style={styles.carousel_category}>Media News</Text>
              </View>
              <Text style={styles.metadataText}>{item.reads}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataText}>{item.category}</Text>
              <Text style={styles.metadataText}>•</Text>
              <Text style={styles.metadataText}>2.4 K Reads</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  ), []);

  // Memoized function for handling progress change
  const handleProgressChange = useCallback((_, absoluteProgress) => {
    const roundedIndex = Math.round(absoluteProgress);
    if (roundedIndex !== currentIndex) {
      setCurrentIndex(roundedIndex);
    }
  }, [currentIndex]);

  const sliderData = posts.slice(0, 5); // Limit to the first 5 items
  const mockSlider = sliderData.map((_, index) => index);

  return (
    <View style={styles.header}>
      <Carousel
        ref={carouselRef}
        loop
        width={screenWidth}
        autoPlay
        autoPlayInterval={3000}
        scrollAnimationDuration={1000}
        onProgressChange={handleProgressChange}
        data={sliderData}
        renderItem={renderCarouselItem}
        style={styles.carousel}
      />
      <View style={styles.pagination}>
        <Pagination
          progress={currentIndex}
          data={mockSlider}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          containerStyle={styles.paginationContainer}
          horizontal
          onPress={onPressPagination}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: screenWidth,
    position: 'relative',
  },
  carousel: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.5,
    marginLeft: screenWidth * 0.02,
    borderRadius: 10,
  },
  carouselItem: {
    width: '100%',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 50,
  },
  carouselItemWrapper: {
    position: 'relative',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 30,
    marginBottom: 10,
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '99%',
  },
  metadataRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  carousel_dot: {
    width: 25,
    height: 25,
    backgroundColor: '#001148',
    borderRadius: 12.5,
    marginRight: 8,
  },
  carousel_category: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  metadataText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginHorizontal: 5,
  },
  pagination: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth * 0.95,
    marginLeft: screenWidth * 0.02,
  },
  dotStyle: {
    width: 40,
    height: 4,
    backgroundColor: '#001148',
  },
  activeDotStyle: {
    backgroundColor: '#f1f1f1',
  },
  paginationContainer: {
    gap: 10,
    marginBottom: 10,
  },
});