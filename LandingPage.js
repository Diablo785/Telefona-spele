import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainMenu = () => {
  const navigation = useNavigation();
  const logoSlideInAnimation = useRef(new Animated.Value(-200)).current;
  const buttonsSlideInAnimation = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoSlideInAnimation, {
        toValue: 30,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsSlideInAnimation, {
        toValue: 100,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoSlideInAnimation }] }]}>
        <Image source={require('./images/logo.png')} style={styles.logo} />
      </Animated.View>
      <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonsSlideInAnimation }] }]}>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 225,
  },
  loginButton: {
    backgroundColor: '#0C9600',
    width: 145,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#2059EC',
    width: 185,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
});

export default MainMenu;