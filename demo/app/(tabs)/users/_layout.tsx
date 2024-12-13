import { Stack } from 'expo-router'

export default function ArticlesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#003366' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'CÁ NHÂN',
        }}
      />
      <Stack.Screen
        name="wallet"
        options={{
          title: 'VÍ TIỀN',
        }}
      />
      <Stack.Screen
        name="subscription"
        options={{
          title: 'NÂNG CẤP TÀI KHOẢN',
        }}
      />
      <Stack.Screen
        name="utility"
        options={{
          title: 'Utility',
        }}
      />

      <Stack.Screen
        name="deposit"
        options={{
          title: 'deposit',
        }}
      />
    </Stack>
  )
}
