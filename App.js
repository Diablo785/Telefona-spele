import React, { useState, useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenu from './MainMenu';
import LandingPage from './LandingPage';
import Game from './Game';
import Skins from './Skins';
import Login from './Login';
import Register from './Register';
import Info from './Info';
import Profile from './Profile';
import Leaderboard from './Leaderboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');
      if (userDataJSON !== null) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking user authentication:', error);
    }
  };

  return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={loggedIn ? "MainMenu" : "LandingPage"}
          screenOptions={{ headerShown: false }}>
          {!loggedIn ? (
            <>
              <Stack.Screen name="LandingPage" component={LandingPage} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="MainMenu" component={MainMenu} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainMenu" component={MainMenu} />
              <Stack.Screen name="Game" component={Game} />
              <Stack.Screen name="Skins" component={PaymentWrapper} />
              <Stack.Screen name="Info" component={Info} />
              <Stack.Screen name="LandingPage" component={LandingPage} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Leaderboard" component={Leaderboard} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;



function PaymentWrapper() {
  return (
    <StripeProvider
      publishableKey="pk_test_51PFvvo1DYMoaKsH8LU7h9j4D9sDRlIWQgtH9LPLuwlQjL9Izayz3lbGCsWoNd8DcwUP5GPWdoy2TzrDT4cfiFRgS00Xc1Yk8vr"
    >
      <Skins />
    </StripeProvider>
  );
}