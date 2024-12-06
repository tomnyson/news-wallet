import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

export default function Pagination({
  progress,
  data,
  dotStyle,
  activeDotStyle,
  containerStyle,
  onPress,
  horizontal = true,
}) {
  return (
    <View style={[styles.paginationContainer, containerStyle, { flexDirection: horizontal ? 'row' : 'column' }]}>
      {data.map((item, index) => {
        const isActive = Math.round(progress) === index;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onPress && onPress(index)} // Call onPress if provided
            style={[
              styles.dot,
              dotStyle,
              isActive ? activeDotStyle : null, // Apply active style conditionally
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
