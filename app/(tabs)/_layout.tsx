import React from 'react'
import { Tabs } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#111827',
                    height: 60,
                    paddingBottom: 5,
                    borderTopWidth: 0.5,
                    borderTopColor: '#e5e7eb',
                },
                tabBarActiveTintColor: '#3b82f6',
                tabBarLabelStyle: {
                    fontWeight: 'bold',
                }
            }}
        >
            <Tabs.Screen name="Home" options={{
                title: 'Home',
                tabBarIcon: ({ color }) => (
                    <MaterialIcons
                        name="home"
                        size={25}
                        color={color}
                    />
                )
            }} />
            <Tabs.Screen name="AllTransactions" options={{
                title: 'All Transactions',
                tabBarIcon: ({ color }) => (
                    <MaterialIcons
                        name="list-alt"
                        size={25}
                        color={color}
                    />
                )
            }} />
            <Tabs.Screen name="AddTransaction" options={{
                title: 'Add Transaction',
                tabBarIcon: ({ color }) => (
                    <MaterialIcons
                        name="add-circle"
                        size={25}
                        color={color}
                    />
                )
            }} />
            <Tabs.Screen name="Profile" options={{
                title: 'Profile',
                tabBarIcon: ({ color }) => (
                    <MaterialIcons
                        name="person"
                        size={25}
                        color={color}
                    />
                )
            }} />
        </Tabs>
    )
}

export default TabsLayout