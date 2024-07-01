import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [credits, setCredits] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [userId, setUserId] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserDataFromStorage();
  }, []);

  const getUserDataFromStorage = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        setUsername(parsedUserData.username);
        setEmail(parsedUserData.email);
        setPassword(parsedUserData.password);
        setCredits(parsedUserData.credits);
        setJoinDate(parsedUserData.joinDate);
      }
    } catch (error) {
      console.error('Error getting user data from AsyncStorage:', error);
    }
  };

  const handleSavePress = async () => {
    setError('');

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

    try {
      const updatedUserData = { userId: userData.id, username, email, password, credits, joinDate };
      const updateUrl = 'http://192.168.46.184/speeliite/updateAccount.php';
      const response = await fetch(updateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        setIsEditing(false);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const handleMainMenuPress = () => {
    navigation.navigate('MainMenu');
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor="#888"
          />
          <View style={{ ...styles.inputContainer, width: '80%' }}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={{ ...styles.passwordInput, flex: 1 }}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity onPress={handleSavePress} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.name}>{userData ? userData.username : 'User'}</Text>

          <Text style={styles.label}>Password:</Text>
          <Text
            style={styles.password}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (userData ? userData.password : 'Password') : '*'.repeat(password.length)}
            <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color="white" style={styles.eyeIcon} />
          </Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.email}>{userData ? userData.email : 'Email'}</Text>

          <Text style={styles.label}>Credits:</Text>
          <Text style={styles.credits}>{userData ? userData.credits : 'Credits'}$</Text>

          <Text style={styles.label}>Join Date:</Text>
          <Text style={styles.joinDate}>{userData ? userData.joinDate : 'Join Date'}</Text>

          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={handleMainMenuPress} style={styles.button}>
        <Text style={styles.buttonText}>Main Menu</Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  email: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  password: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  credits: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  joinDate: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  error: {
    color: 'red',
    fontSize: 18,
    marginBottom: 5,
  },
});

export default Profile;
