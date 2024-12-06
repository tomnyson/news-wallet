import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
export default function ProfileScreen() {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigation = useNavigation();

  const utilities = [
    { id: "1", name: "Lịch Việt", icon: "calendar-outline", library: "Ionicons" },
    { id: "2", name: "Thời tiết", icon: "sunny-outline", library: "Ionicons" },
    { id: "3", name: "Kết quả xổ số", icon: "ticket", library: "FontAwesome" },
    { id: "4", name: "Giá vàng & Ngoại tệ", icon: "balance-scale", library: "FontAwesome" },
    { id: "5", name: "Tỷ số bóng đá", icon: "football-outline", library: "Ionicons" },
    { id: "6", name: "Ví tiền", icon: "wallet-outline", library: "Ionicons" },
  ];

  const renderUtilityItem = ({ item }) => (
    <TouchableOpacity style={styles.utilityItem}>
      {item.library === "Ionicons" ? (
        <Ionicons name={item.icon} size={20} color="#555" />
      ) : (
        <FontAwesome name={item.icon} size={20} color="#555" />
      )}
      <Text style={styles.utilityText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={require("../assets/images-holder.png")}
          style={styles.avatar}
        />
        {isAuthenticated ?(
        <TouchableOpacity onPress={()=>navigation.navigate("Login")}>
          <Text style={styles.profileName}>Đăng nhập</Text>
        </TouchableOpacity>
        ):(
        <TouchableOpacity onPress={()=> {
          console.log(navigation.getState().routes);
          AsyncStorage.removeItem('token');
          navigation.navigate('AuthStack', { screen: 'Login' });
        }}>
          <Text style={styles.profileName}>Đăng Xuất</Text>
        </TouchableOpacity>
        )}
      </View>

      {/* Saved Options */}
      <View style={styles.savedOptions}>
        <View>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="bookmark" size={20} color="#003366" />
          <Text style={styles.optionText}>Đã lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="checkbox" size={20} color="#003366" />
          <Text style={styles.optionText}>Đang theo dõi</Text>
        </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="cloud-download" size={20} color="#003366" />
          <Text style={styles.optionText}>Tin đã tải</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="time" size={20} color="#003366" />
          <Text style={styles.optionText}>Đọc gần đây</Text>
        </TouchableOpacity>
        </View>
      </View>

      {/* Utilities Section */}
      <Text style={styles.utilitiesTitle}>TIỆN ÍCH</Text>
      <FlatList
        data={utilities}
        keyExtractor={(item) => item.id}
        renderItem={renderUtilityItem}
        contentContainerStyle={styles.utilitiesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  savedOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionItem: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    marginBottom: 16,
  },
  optionText: {
    marginInlineStart: 8,
    fontSize: 14,
    color: "#003366",
    fontWeight: "500",
  },
  utilitiesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  utilitiesList: {
    paddingHorizontal: 16,
  },
  utilityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  utilityText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#555",
  },
});
