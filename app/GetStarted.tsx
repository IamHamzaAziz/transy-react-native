import { Text, SafeAreaView, ScrollView, TouchableHighlight } from 'react-native'
import React, { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { SplashScreen, router } from 'expo-router'

SplashScreen.preventAutoHideAsync()

const GetStarted = () => {
    const [fontsLoaded, error] = useFonts({
        "DancingScript": require("../assets/fonts/DancingScript.ttf"),
    })

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) {
        return null;
    }

    if (!fontsLoaded && !error) {
        return null;
    }

    return (
        <SafeAreaView>
            <ScrollView className='bg-gray-900' contentContainerStyle={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text className='font-bold text-3xl text-gray-200'>Track Transactions</Text>
                <Text className='font-bold text-3xl text-gray-200'>With <Text className='font-DancingScript text-gray-200'>Transy</Text></Text>

                <TouchableHighlight className='mt-5 bg-blue-700 w-[80%] p-3 rounded-lg' onPress={() => router.push('/(auth)/Login')}>
                    <Text className='text-white text-2xl text-center font-bold'>Get Started</Text>
                </TouchableHighlight>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GetStarted