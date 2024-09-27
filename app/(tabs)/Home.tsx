import { SafeAreaView, Text, ScrollView, View, ActivityIndicator, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/config/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { router } from 'expo-router'

interface Item {
    id: string,
    title: string,
    amount: number,
    type: string,
    user: string,
    createdAt: Date
}

const Home = () => {
    const [totalIncome, setTotalIncome] = useState<number>(0)
    const [totalExpenses, setTotalExpenses] = useState<number>(0)
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [userID, setUserID] = useState<string | null>('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserID(user.uid)
            } else {
                router.replace('/GetStarted')
            }
        })

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        fetchStats()
    }, [userID])

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    async function fetchStats() {
        setLoading(true)
        const transactionsCollection = collection(db, 'transactions')
        const q = query(transactionsCollection, where('user', '==', userID))

        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Item[]

        // Calculate total incomes, expenses, and combined total
        let income = 0
        let expenses = 0

        data.forEach(transaction => {
            if (transaction.type === 'Income') {
                income += transaction.amount
            } else if (transaction.type === 'Expense') {
                expenses += transaction.amount
            }
        })

        setTotalIncome(income)
        setTotalExpenses(expenses)
        setTotalAmount(income - expenses)
        setLoading(false)
    }

    return (
        <SafeAreaView className='h-full bg-gray-900'>
            <ScrollView contentContainerStyle={{
                padding: 20,
                minHeight: '100%',
                justifyContent: 'center'
            }}>
                {
                    loading ? (
                        <ActivityIndicator size={'large'} color={'white'} />
                    ) : (
                        <>
                            <View className='bg-blue-700 px-5 py-3 w-full rounded-xl'>
                                <View className='flex-row items-center justify-between'>
                                    <Text className='text-gray-200 text-2xl font-bold'>Your Balance</Text>
                                    <FontAwesome name='money' size={25} color='white' />
                                </View>

                                <View className='flex-row items-center mt-2'>
                                    <FontAwesome name='dollar' size={25} color='white' />
                                    <Text className='text-gray-200 ml-2 text-2xl font-bold'>{totalAmount}</Text>
                                </View>
                            </View >

                            <View className='bg-green-600 px-5 py-3 w-full rounded-xl mt-10'>
                                <View className='flex-row items-center justify-between'>
                                    <Text className='text-gray-200 text-2xl font-bold'>Your Icome</Text>
                                    <FontAwesome name='arrow-down' size={25} color='white' />
                                </View>

                                <View className='flex-row items-center mt-2'>
                                    <FontAwesome name='dollar' size={25} color='white' />
                                    <Text className='text-gray-200 ml-2 text-2xl font-bold'>{totalIncome}</Text>
                                </View>
                            </View>

                            <View className='bg-red-600 px-5 py-3 w-full rounded-xl mt-10'>
                                <View className='flex-row items-center justify-between'>
                                    <Text className='text-gray-200 text-2xl font-bold'>Your Expenses</Text>
                                    <FontAwesome name='arrow-up' size={25} color='white' />
                                </View>

                                <View className='flex-row items-center mt-2'>
                                    <FontAwesome name='dollar' size={25} color='white' />
                                    <Text className='text-gray-200 ml-2 text-2xl font-bold'>{totalExpenses}</Text>
                                </View>
                            </View>
                        </>
                    )
                }
            </ScrollView >
        </SafeAreaView >
    )
}

export default Home