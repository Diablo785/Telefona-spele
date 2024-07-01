import React from 'react';
import { View, Image } from 'react-native';

const Flame = ({ playerPosition }) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 125, // Adjust the distance from the player as needed
        left: playerPosition + 5, // Adjust the offset as needed
        transform: [{ rotate: '180deg' }], // Rotate the flame image 180 degrees
      }}
    >
      <Image source={require('./images/flame.gif')} style={{ width: 50, height: 50 }} />
    </View>
  );
};

export default Flame;
