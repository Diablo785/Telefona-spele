import { useStripe } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentWindow = ({ isVisible, onClose }) => {
    const navigation = useNavigation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentIntentData, setPaymentIntentData] = useState(null);
    const [inProgress, setInProgress] = useState(false);

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch(`http://192.168.46.184/speeliite/payment.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: inputValue }),
            });
            const responseBody = await response.json();
            const { paymentIntent, ephemeralKey, customer, publishableKey } = responseBody;
            return { paymentIntent, ephemeralKey, customer, publishableKey };
        } catch (error) {
            console.error("Error fetching payment sheet params:", error);
            throw new Error("Error fetching payment sheet params");
        }
    };

    const initializePaymentSheet = async () => {
        try {
            const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
            const { error } = await initPaymentSheet({
                merchantDisplayName: "Your Merchant Name", // Set a valid merchant name here
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                allowsDelayedPaymentMethods: true,
            });
            if (!error) {
                setPaymentIntentData(paymentIntent);
                setLoading(false);
            } else {
                console.error("Error initializing payment sheet:", error);
                setError("Error initializing payment sheet");
            }
        } catch (error) {
            console.error("Error initializing payment sheet:", error);
            setError("Error initializing payment sheet");
            setLoading(false);
        }
    };

    const openPaymentSheet = async () => {
        try {
            const { error } = await presentPaymentSheet();
            if (error) {
                Alert.alert(`Error code: ${error.code}`, error.message);
            } else {
                Alert.alert('Success', 'Your order is confirmed!');
                confirmPayment();
            }
        } catch (error) {
            console.error("Error opening payment sheet:", error);
            setError("Error opening payment sheet");
        }
    };

    const confirmPayment = async () => {
        try {
            const response = await fetch('http://192.168.46.184/speeliite/paymentConfirm.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: inputValue }),
            });
            if (response.ok) {
                setError('Your order is confirmed!');
            } else {
                setError('Error confirming payment. Please try again.');
            }
        } catch (error) {
            console.error("Error confirming payment:", error);
            setError('Error confirming payment. Please try again.');
        }
    };

    const handleConfirm = async () => {
        if(inProgress){
            return;
        }
        setInProgress(true);
        if (inputValue === '' || inputValue <= 0) {
            setError("Enter a valid value");
        } else {
            setError("Please wait");
            setLoading(true);
            try {
                await initializePaymentSheet();
                await openPaymentSheet();
            } catch (error) {
                setError('Error processing payment. Please try again.');
                setLoading(false);
            }
        } setInProgress(false);
    };

    const handleInputChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setInputValue(numericText);
    };


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.popupContainer}>
                <View style={styles.popup}>
                    <Text style={styles.popupText}>Enter a number:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Enter number"
                        value={inputValue}
                        onChangeText={handleInputChange}
                    />
                    <Text style={styles.errorText}>{error !== "Please wait" && error}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.popupButton, styles.confirmButton]} onPress={handleConfirm} disabled={loading}>
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.popupButton, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    popupText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    popupButton: {
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    confirmButton: {
        backgroundColor: 'green',
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default PaymentWindow;
