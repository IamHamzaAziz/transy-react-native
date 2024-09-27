import { useEffect } from "react"
import { auth } from "@/config/firebase"
import { router } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'

const Index = () => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace('/(tabs)/Home')
            } else {
                router.replace('/GetStarted')
            }
        })

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [])

    return null
}

export default Index