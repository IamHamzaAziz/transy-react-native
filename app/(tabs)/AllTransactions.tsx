import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/config/firebase'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { router } from 'expo-router'

interface Item {
    id: string,
    title: string,
    amount: number,
    type: string,
    user: string,
    createdAt: Date
}

const AllTransactions = () => {
    const [userID, setUserID] = useState('')
    const [transactions, setTransactions] = useState<Item[]>([])

    const [loading, setLoading] = useState(false)

    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserID(user.uid)
            } else {
                router.replace('/GetStarted')
            }
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        fetchTransactions()
    }, [userID])

    async function fetchTransactions() {
        try {
            setLoading(true)
            const transactionsCollection = collection(db, 'transactions')

            const q = query(transactionsCollection, where('user', '==', userID), orderBy('createdAt', 'desc'))

            const snapshot = await getDocs(q)

            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as Item[]

            setTransactions(data)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching transactions: ", error)
            setLoading(false)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchTransactions() // Re-fetch the data
        setRefreshing(false) // End the refreshing state
    }

    return (
        <SafeAreaView className='bg-gray-900 h-full'>
            <ScrollView contentContainerStyle={{
                padding: 20,
                minHeight: '100%',
            }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing} // Pull-to-refresh state
                        onRefresh={handleRefresh} // Function to handle refresh
                        tintColor="white" // Loader color
                    />
                }
            >
                <Text className='mt-5 mb-10 text-3xl text-gray-200 font-bold text-center'>Your Transactions</Text>

                {
                    loading ? (
                        <ActivityIndicator size="large" color="white" />
                    ) : transactions.length === 0 ? (
                        <Text className='text-gray-400 text-xl text-center'>No transactions found</Text>
                    ) : (
                        transactions.map(transaction => {
                            if (transaction.type === 'Income') {
                                return (
                                    <View className='bg-green-600 px-5 py-3 w-full rounded-xl mb-4' key={transaction.id}>
                                        <View className='flex-row items-center justify-between'>
                                            <Text className='text-gray-200 text-lg font-bold'>{transaction.title}</Text>
                                            <FontAwesome name='arrow-down' size={20} color='white' />
                                        </View>

                                        <View className='flex-row items-center mt-2'>
                                            <FontAwesome name='dollar' size={20} color='white' />
                                            <Text className='text-gray-200 ml-2 text-lg font-bold'>{transaction.amount}</Text>
                                        </View>
                                    </View>
                                )
                            } else if (transaction.type === 'Expense') {
                                return (
                                    <View className='bg-red-600 px-5 py-3 w-full rounded-xl mb-4' key={transaction.id}>
                                        <View className='flex-row items-center justify-between'>
                                            <Text className='text-gray-200 text-lg font-bold'>{transaction.title}</Text>
                                            <FontAwesome name='arrow-up' size={20} color='white' />
                                        </View>

                                        <View className='flex-row items-center mt-2'>
                                            <FontAwesome name='dollar' size={20} color='white' />
                                            <Text className='text-gray-200 ml-2 text-lg font-bold'>{transaction.amount}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        })
                    )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default AllTransactions