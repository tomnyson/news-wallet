import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ImageBackground } from "react-native";

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        console.log('call this function');
        const timeout = setTimeout(() => {
            router.push('/login');
        }, 3000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <ImageBackground
            source={require('@/assets/images/splash_screen.png')}
            accessible
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
    );
}