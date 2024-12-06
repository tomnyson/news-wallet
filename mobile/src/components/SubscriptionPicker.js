import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SubscriptionPicker({onChange}) {
  const [selectedValue, setSelectedValue] = useState('12');

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue) =>{ setSelectedValue(itemValue)
            onChange(itemValue)
        }}
      >
        <Picker.Item label="1 Month" value="1" />
        <Picker.Item label="3 Months" value="3" />
        <Picker.Item label="6 Months" value="6" />
        <Picker.Item label="1 Year" value="12" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    ...Platform.select({
      ios: {
        height: 200,
      },
    }),
  },
});