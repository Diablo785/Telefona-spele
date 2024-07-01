import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Platform, AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from './SideBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const MainMenu = () => {
  const navigation = useNavigation();
  const logoSlideInAnimation = useRef(new Animated.Value(-200)).current;
  const buttonsSlideInAnimation = useRef(new Animated.Value(300)).current;
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    setSidebarOpen(false);
    getUserDataFromStorage();
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  useEffect(() => {
    Animated.timing(logoSlideInAnimation, {
      toValue: 30,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getUserDataFromStorage = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
    } catch (error) {
      console.error('Error getting user data from AsyncStorage:', error);
    }
  };

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
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('./sound/main.mp3'));
      setSound(sound);
      await sound.playAsync();
      sound.setIsLoopingAsync(true);
    };

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && sound) {
        sound.playAsync();
      } else if (sound) {
        sound.pauseAsync();
      }
    };

    playSound();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoSlideInAnimation }] }]}>
        <Image source={require('./images/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={toggleSidebar} style={styles.burgerIcon}>
          <Image source={require('./images/burger_menu.png')} style={styles.burgerMenuIcon} />
        </TouchableOpacity>
      </Animated.View>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText} onPress={() => navigation.navigate('Profile')}>Welcome,</Text>
        <Text style={styles.usernameText} onPress={() => navigation.navigate('Profile')}>{userData ? userData.username : 'User'}!</Text>
      </View>
      <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonsSlideInAnimation }] }]}>
        <ShadowWrapper>
          <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('Game')}>
            <Text style={styles.buttonText}>PLAY</Text>
          </TouchableOpacity>
        </ShadowWrapper>
        <ShadowWrapper>
          <TouchableOpacity style={styles.skinsButton} onPress={() => navigation.navigate('Skins')}>
            <Text style={styles.buttonText}>SKINS</Text>
          </TouchableOpacity>
        </ShadowWrapper>
        <ShadowWrapper>
          <TouchableOpacity style={styles.infoButton} onPress={() => navigation.navigate('Info')}>
            <Text style={styles.buttonText}>INFO</Text>
          </TouchableOpacity>
        </ShadowWrapper>
      </Animated.View>
    </View>
  );
};

const ShadowWrapper = ({ children }) => {
  return Platform.OS === 'ios' ? (
    <View style={styles.shadowWrapper}>
      {children}
    </View>
  ) : (
    <View>
      {children}
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
    zIndex: 1,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  burgerIcon: {
    position: 'absolute',
    zIndex: 5,
    top: 0,
    left: 0,
  },
  burgerMenuIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 150,
  },
  playButton: {
    backgroundColor: '#0C9600',
    width: 165,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  skinsButton: {
    backgroundColor: '#A00000',
    width: 165,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  infoButton: {
    backgroundColor: '#2059EC',
    width: 165,
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
  shadowWrapper: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    elevation: 5,
    borderRadius: 10,
  },
  welcomeText: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
  },
  usernameText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  userDataContainer: {
    top: 15,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
});

export default MainMenu;