import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Background1.jpg')} 
        style={styles.background}
      />

      <Image
        source={require('../assets/small-logo.png')} 
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height, 
    resizeMode: 'cover', 
  },
  logo: {
    marginBottom: 40,
  },
});
