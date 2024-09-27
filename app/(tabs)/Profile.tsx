import { SafeAreaView, Text, ScrollView, View, TouchableHighlight, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '@/config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { router } from 'expo-router'

const Profile = () => {
    const [email, setEmail] = useState<string | null>('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email)
            } else {
                router.replace('/GetStarted')
            }
        })

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [])

    const logout = async () => {
        setLoading(true)
        await signOut(auth)
        setLoading(false)

        router.replace('/GetStarted')
    }

    return (
        <SafeAreaView>
            <ScrollView className='bg-gray-900' contentContainerStyle={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 5
            }}>
                <View className='bg-gray-200 w-[80%] h-[60] rounded-xl text-center flex justify-center items-center'>
                    <Text className='text-gray-900 text-lg'>Email: {email && email}</Text>
                </View>

                {
                    loading ? (
                        <TouchableHighlight className='bg-red-600 mt-5 w-[80%] h-[60] rounded-xl text-center flex justify-center items-center'>
                            <ActivityIndicator size={'small'} color={'#e5e7eb'} />
                        </TouchableHighlight>
                    ) : (
                        <TouchableHighlight className='bg-red-600 mt-5 w-[80%] h-[60] rounded-xl text-center flex justify-center items-center' onPress={logout}>
                            <Text className='text-gray-200 font-bold text-lg'>Logout</Text>
                        </TouchableHighlight>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile