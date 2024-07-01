import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, TextInput, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  
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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardOpen(false);
    });

    return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
    };
}, []);

  const handleRegistration = async () => {
    if (!username || !password || !email) {
      setError('Please fill in all fields');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
  
    if (username.length < 6 || username.length > 14) {
      setError('Username must be between 6 and 14 characters long');
      return;
    }
  
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
  
    const registerUrl = 'http://192.168.46.184/speeliite/register.php';
  
    console.log('Registering user with username:', username);
    console.log('Registering user with password:', password);
    console.log('Registering user with email:', email);
    
    const registerOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    };
  
    try {
      const registerResponse = await fetch(registerUrl, registerOptions);
      const registerData = await registerResponse.json();
    
      if (registerData.success) {
        const loginUrl = 'http://192.168.46.184/speeliite/login.php';
        const loginOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        };
    
        const loginResponse = await fetch(loginUrl, loginOptions);
        const loginData = await loginResponse.json();
    
        if (loginData.success) {
          await AsyncStorage.setItem('userData', JSON.stringify(loginData.userData));

          navigation.navigate('MainMenu', { userData: loginData.userData });
        } else {
          setError('Login failed');
        }
      } else {
        setError(registerData.message);
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('An error occurred. Please try again.');
    }
  };
  

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
        {!isKeyboardOpen && (
        <>
            <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoSlideInAnimation }] }]}>
              <Image source={require('./images/logo.png')} style={styles.logo} />
            </Animated.View>

            <View style={styles.middleContainer}>
              <TouchableOpacity style={styles.leftButton} onPress={navigateToLogin}>
                <Image source={require('./images/arrow_left.png')} style={styles.arrowImage} />
              </TouchableOpacity>
              <Text style={styles.loginText}>REGISTER</Text>
              <TouchableOpacity style={styles.rightButton} onPress={navigateToLogin}>
                <Image source={require('./images/arrow_right.png')} style={styles.arrowImage} />
              </TouchableOpacity>
            </View>
        </>
        )}
      <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonsSlideInAnimation }] }]}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#2059EC"
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#2059EC"
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#2059EC"
          onChangeText={setEmail}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegistration}>
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
    top: 10,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  arrowImage: {
    width: 55,
    height: 55,
  },
  middleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: '47%',
    width: '100%',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopColor: '#2059EC',
    borderBottomColor: '#2059EC',
    borderWidth: 1,
  },
  loginText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  leftButton: {
    marginRight: 'auto',
  },
  rightButton: {
    marginLeft: 'auto',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
  },
  input: {
    backgroundColor: 'transparent',
    width: 200,
    height: 50,
    marginBottom: 14,
    paddingLeft: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2059EC',
    color: '#2059EC',
    fontSize: 30,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#2059EC',
    width: 185,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 18,
    marginBottom: 5,
  },
});

export default Register;
