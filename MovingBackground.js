import React, { useEffect, useRef } from 'react';
import { View, Animated, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const MovingBackground = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.timing(scrollY, {
          toValue: height,
          duration: 4000, // Adjust the duration to control the speed
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
  }, [scrollY]);

  const translateY = scrollY.interpolate({
    inputRange: [0, height],
    outputRange: [0, height],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: scrollY }] }}>
        <Image source={require('./images/Screenshot_5.png')} style={styles.image} />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          top: -height,
          transform: [{ translateY: scrollY }],
        }}
      >
        <Image source={require('./images/Screenshot_5.png')} style={styles.image} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: 375,
    height: 841,
  },
});

export default MovingBackground;
