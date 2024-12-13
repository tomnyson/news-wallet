import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

export default function Pagination({
  progress = 0, // Default progress to 0
  data = [], // Default to empty array if data is not provided
  onPress,
  horizontal = true,
  containerStyle = {}, // Default to empty object
  dotStyle = {}, // Default to empty object
  activeDotStyle = {}, // Default to empty object
}) {
  return (
    <View
      style={[
        styles.paginationContainer,
        containerStyle,
        { flexDirection: horizontal ? "row" : "column" },
      ]}
    >
      {data.map((_, index) => {
        const isActive = progress === index;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onPress && onPress(index)} // Call onPress if provided
            style={[
              styles.dot,
              dotStyle,
              isActive ? [styles.activeDot, activeDotStyle] : null, // Apply active style conditionally
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
    backgroundColor: "#ccc", 
  },
  activeDot: {
    backgroundColor: "#000",
  },
});