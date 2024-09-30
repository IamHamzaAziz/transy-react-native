import {
    TextInput,
    Text,
    SafeAreaView,
    ScrollView,
    Modal,
    View,
    Pressable,
    Alert,
    ActivityIndicator,
    ToastAndroid,
    Platform
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { router } from "expo-router";

const AddTransaction = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionType, setTransactionType] = useState("");

    const [userID, setUserID] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserID(user.uid);
            } else {
                router.replace("/GetStarted");
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        if (!title || !amount || !transactionType) {
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    "Please fill all fields",
                    ToastAndroid.SHORT
                )
                setLoading(false)
                return
            }

            Alert.alert("Error", "Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            const transCollection = collection(db, "transactions");

            await addDoc(transCollection, {
                title,
                amount: parseFloat(amount),
                type: transactionType,
                user: userID,
                createdAt: new Date(),
            });

            if (Platform.OS === "android") {
                ToastAndroid.show(
                    "Transaction added successfully",
                    ToastAndroid.SHORT
                )
                setLoading(false)
                setTitle("");
                setAmount("");
                setTransactionType("")
                return
            }

            Alert.alert("Success", "Transaction added successfully");
            setLoading(false);
            setTitle("");
            setAmount("");
            setTransactionType("");
        } catch (error) {
            if (Platform.OS === "android") {
                ToastAndroid.show(
                    "Unable to add transaction",
                    ToastAndroid.SHORT
                )
                setLoading(false)
                console.error(error);
            } else {
                Alert.alert("Error", "Cannot add transaction");
                setLoading(false);
                console.error(error);
            }

        }
    };

    return (
        <SafeAreaView className="h-full bg-gray-900">
            <ScrollView
                contentContainerStyle={{
                    minHeight: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                }}
            >
                <Text className="text-3xl text-gray-200 font-bold text-center">
                    Add Transaction
                </Text>

                <TextInput
                    className="w-full bg-gray-200 mt-10 px-4 py-2 rounded-lg"
                    placeholder="Enter Transaction Title"
                    autoCapitalize="none"
                    value={title}
                    onChangeText={setTitle}
                />

                <TextInput
                    className="w-full bg-gray-200 mt-3 px-4 py-2 rounded-lg"
                    placeholder="Enter Transaction Amount"
                    autoCapitalize="none"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <Modal
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <ScrollView
                        contentContainerStyle={{
                            minHeight: "100%",
                        }}
                    >
                        <View className="h-full bg-gray-800 items-center justify-center">
                            <Text className="text-xl font-bold text-gray-200">
                                Select Transaction Type
                            </Text>

                            <Pressable
                                onPress={() => {
                                    setTransactionType("Income");
                                    setModalVisible(!modalVisible);
                                }}
                                className="w-[80%] mt-3 bg-green-600 p-2 rounded-lg flex-row justify-center items-center space-x-2"
                            >
                                <Text className="text-center text-gray-200 font-bold text-xl">
                                    Income
                                </Text>
                                <FontAwesome name="arrow-down" color={"white"} size={20} />
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    setTransactionType("Expense");
                                    setModalVisible(!modalVisible);
                                }}
                                className="w-[80%] mt-3 bg-red-600 p-2 rounded-lg flex-row justify-center items-center space-x-2"
                            >
                                <Text className="text-center text-gray-200 font-bold text-xl">
                                    Expense
                                </Text>
                                <FontAwesome name="arrow-up" color={"white"} size={20} />
                            </Pressable>
                        </View>
                    </ScrollView>
                </Modal>

                <Pressable
                    onPress={() => setModalVisible(true)}
                    className="w-full flex-row bg-gray-200 mt-3 px-4 py-2 rounded-lg h-[45] justify-between items-center"
                >
                    <Text className="text-gray-600">
                        {transactionType ? transactionType : "Select Transaction Type"}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={30} color={"black"} />
                </Pressable>

                {loading ? (
                    <View className="mt-3 h-[45] p-2 bg-blue-700 justify-center w-full rounded-lg">
                        <ActivityIndicator size="small" color="white" />
                    </View>
                ) : (
                    <Pressable
                        className="mt-3 h-[45] p-2 bg-blue-700 justify-center w-full rounded-lg"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white font-bold text-center">
                            Submit Transaction
                        </Text>
                    </Pressable>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddTransaction;
