import {
    SafeAreaView,
    Text,
    ScrollView,
    TextInput,
    TouchableHighlight,
    Alert,
    ActivityIndicator,
    Pressable,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Link, router } from "expo-router";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";

SplashScreen.preventAutoHideAsync();

const Login = () => {
    const [fontsLoaded, error] = useFonts({
        DancingScript: require("../../assets/fonts/DancingScript.ttf"),
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace("/(tabs)/Home");
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

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

    const handleSubmit = async () => {
        setLoading(true);

        if (!email || !password) {
            Alert.alert("Cannot Log In", "Please fill all fields");
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Cannot Log In", "Invalid Email");
            setLoading(false);
            return;
        }

        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user) router.replace("/(tabs)/Home");
        } catch (error: any) {
            Alert.alert("Cannot Log In", "Invalid Credentials");
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="h-full">
            <ScrollView
                className="bg-gray-900"
                contentContainerStyle={{
                    minHeight: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text className="font-bold text-3xl text-gray-200">
                    Log In to <Text className="font-DancingScript">Transy</Text>
                </Text>

                <TextInput
                    placeholder="Your Email"
                    className="w-[80%] bg-gray-200 px-4 py-2 mt-10 rounded-lg"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Your Password"
                    className="w-[80%] bg-gray-200 px-4 py-2 mt-3 rounded-lg"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                {loading ? (
                    <Pressable className="w-[80%] bg-blue-700 px-4 py-2 mt-5 rounded-lg h-[45] justify-center">
                        <ActivityIndicator size="small" color="white" />
                    </Pressable>
                ) : (
                    <Pressable
                        className="w-[80%] bg-blue-700 px-4 py-2 mt-5 rounded-lg h-[45]"
                        onPress={handleSubmit}
                    >
                        <Text className="text-center text-gray-200 font-bold text-xl">
                            Log In
                        </Text>
                    </Pressable>
                )}

                <Text className="text-sm text-gray-200 mt-10">
                    Do not have an account?
                </Text>

                <Link href={"/(auth)/SignUp"}>
                    <Text className="text-blue-500 font-bold text-sm">Sign Up</Text>
                </Link>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;
