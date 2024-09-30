import {
    SafeAreaView,
    Text,
    ScrollView,
    TextInput,
    Pressable,
    ActivityIndicator,
    Alert,
    Platform,
    KeyboardAvoidingView,
    ToastAndroid
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { Link, router } from "expo-router";
import { auth } from "@/config/firebase";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";

SplashScreen.preventAutoHideAsync();

const SignUp = () => {
    const [fontsLoaded, error] = useFonts({
        DancingScript: require("../../assets/fonts/DancingScript.ttf"),
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

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

        if (!email || !password || !password2) {
            if (Platform.OS === 'android') {
                ToastAndroid.show(
                    "Please fill all fields",
                    ToastAndroid.SHORT
                );
                setLoading(false);
                return;
            }

            Alert.alert("Cannot Sign Up", "Please fill all fields");
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (Platform.OS === 'android') {
                ToastAndroid.show(
                    "Invalid Email",
                    ToastAndroid.SHORT
                );
                setLoading(false);
                return;
            }

            Alert.alert("Cannot Sign Up", "Invalid Email");
            setLoading(false);
            return;
        }

        if (password !== password2) {
            if (Platform.OS === 'android') {
                ToastAndroid.show(
                    "Passwords do not match",
                    ToastAndroid.SHORT
                );
                setLoading(false);
                return;
            }

            Alert.alert("Cannot Sign Up", "Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            if (user) router.replace("/(tabs)/Home");
        } catch (error: any) {
            if (Platform.OS === 'android') {
                ToastAndroid.show(
                    "Please fill all fields",
                    ToastAndroid.SHORT
                );
                setLoading(false)
                console.log(error);
            } else {
                Alert.alert("Cannot Sign Up", error.message);
                setLoading(false)
                console.log(error);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    className="bg-gray-900"
                    contentContainerStyle={{
                        minHeight: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text className="font-bold text-3xl text-gray-200">
                        Sign Up to <Text className="font-DancingScript">Transy</Text>
                    </Text>

                    <TextInput
                        placeholder="Enter Email"
                        className="w-[80%] bg-gray-200 px-4 py-2 mt-10 rounded-lg"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        placeholder="Enter Password"
                        className="w-[80%] bg-gray-200 px-4 py-2 mt-3 rounded-lg"
                        autoCapitalize="none"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TextInput
                        placeholder="Re Enter Password"
                        className="w-[80%] bg-gray-200 px-4 py-2 mt-3 rounded-lg"
                        autoCapitalize="none"
                        secureTextEntry={true}
                        value={password2}
                        onChangeText={setPassword2}
                    />

                    {loading ? (
                        <Pressable className="w-[80%] bg-green-600 px-4 py-2 mt-5 rounded-lg h-[45] justify-center">
                            <ActivityIndicator size="small" color="white" />
                        </Pressable>
                    ) : (
                        <Pressable
                            className="w-[80%] bg-green-600 px-4 py-2 mt-5 rounded-lg h-[45]"
                            onPress={handleSubmit}
                        >
                            <Text className="text-center text-gray-200 font-bold text-xl">
                                Sign Up
                            </Text>
                        </Pressable>
                    )}

                    <Text className="text-sm text-gray-200 mt-10">
                        Already have an account?
                    </Text>

                    <Link href={"/(auth)/Login"}>
                        <Text className="text-blue-500 font-bold text-sm">Log In</Text>
                    </Link>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;
