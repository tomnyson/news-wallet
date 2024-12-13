import { Stack } from "expo-router";

export default function ArticlesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#003366" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: 'center',

      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "BÀI VIẾT",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "BÀI VIẾT CHI TIẾT",
          headerShown: false,
        }}
      />
    </Stack>
  );
}