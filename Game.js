import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Flame from './Flame';
import MovingBackground from './MovingBackground';

const { width, height } = Dimensions.get('window');
const MOVE_INCREMENT = 10;
const COUNTDOWN_DURATION = 3;
const OBSTACLE_SPEED = 12;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 50;

const FPSCounter = React.memo(({ fps }) => (
  <View style={styles.fpsCounter}>
    <Text style={styles.fpsText}>{`${fps}`}</Text>
  </View>
));

const skinImages = {
  Cat: require('./images/cat.png'),
  Dog: require('./images/dog.png'),
  Apple: require('./images/apple.png'),
  Globe: require('./images/globe.png'),
  Toad: require('./images/toad.png'),
  Pickle: require('./images/pickle.png'),
  Rat: require('./images/rat.png'),
  Pig: require('./images/pig.png'),
  Bacha: require('./images/bacha.png'),
  Junko: require('./images/junko.png'),
  Tike: require('./images/tike.png'),
  Xinjo: require('./images/xinjo.png'),
};

const Game = () => {
  const [fps, setFps] = useState(0);
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(width / 2 - 25);
  const [currentDirection, setCurrentDirection] = useState(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [obstaclePositions, setObstaclePositions] = useState([]);
  const [generateBlocks, setGenerateBlocks] = useState(true);
  const [equippedSkin, setEquippedSkin] = useState(null);
  const moveIntervalRef = useRef(null);
  const countdownAnimations = useRef(Array.from({ length: COUNTDOWN_DURATION }, () => new Animated.Value(0))).current;
  const navigation = useNavigation();
  const flameAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const now = performance.now();
      let lastTime = now;
      let frames = 0;

      const loop = () => {
        frames++;
        const currentTime = performance.now();
        if (currentTime - lastTime >= 1000) {
          setFps(frames);
          frames = 0;
          lastTime = currentTime;
        }
        requestAnimationFrame(loop);
      };

      loop();
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const fetchEquippedSkin = async () => {
      try {
        const skin = await AsyncStorage.getItem('equippedSkin');
        setEquippedSkin(skin);
      } catch (error) {
        console.error('Error fetching equipped skin:', error);
      }
    };

    fetchEquippedSkin();
  }, []);

  const moveLeft = useCallback(() => {
    setPlayerPosition((position) => Math.max(0, position - MOVE_INCREMENT));
  }, []);

  const moveRight = useCallback(() => {
    setPlayerPosition((position) => Math.min(width - 50, position + MOVE_INCREMENT));
  }, []);

  const handlePress = useCallback((direction) => {
    setCurrentDirection((prevDirection) => {
      if ((direction === 'left' && prevDirection === 'right') || (direction === 'right' && prevDirection === 'left')) {
        clearInterval(moveIntervalRef.current);
      }
      return direction;
    });
  }, []);

  const handleRelease = useCallback(() => {
    setCurrentDirection(null);
  }, []);

  const handleRestartPress = async () => {
    resetGame();
  };

  const sendScoreToPHP = async (userId, score) => {
    try {
      const response = await fetch('http://192.168.46.184/speeliite/updateScore.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, score }),
      });
      const data = await response.json();
      console.log('Score sent successfully:', data);
    } catch (error) {
      console.error('Error sending score:', error);
    }
  };

  const handlePausePress = () => {
    setIsPaused(true);
  };

  const handleResumePress = () => {
    setIsPaused(false);
    startCountdownAnimations();
  };

  const resetGame = () => {
    setScore(0);
    setCountdown(COUNTDOWN_DURATION);
    clearInterval(moveIntervalRef.current);
    setIsCountdownPaused(false);
    setShowScorePopup(false);
    countdownAnimations.forEach((anim) => anim.setValue(0));
    setPlayerPosition(width / 2 - 25);
    setObstaclePositions([]);
    setGenerateBlocks(true);
    startCountdownAnimations();
  };

  const handleMainMenuPress = async () => {
    navigation.navigate('MainMenu');
  };

  const startCountdownAnimations = () => {
    countdownAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: height / 2 + 100,
        duration: 1000,
        useNativeDriver: true,
        delay: index * 1000,
      }).start();
    });
  };

  const checkCollision = useCallback(() => {
    let collisionDetected = false;
    obstaclePositions.forEach((obstacle) => {
      if (
        playerPosition < obstacle.x + OBSTACLE_WIDTH &&
        playerPosition + 50 > obstacle.x &&
        height - 175 < obstacle.y + OBSTACLE_HEIGHT &&
        obstacle.y < height - 175
      ) {
        clearInterval(moveIntervalRef.current);
        setIsCountdownPaused(true);
        collisionDetected = true;
      }
    });
    if (collisionDetected) {
      setGenerateBlocks(false);
      setTimeout(() => setShowScorePopup(true), 1000);
    }
  }, [obstaclePositions, playerPosition]);

  const generateObstacle = useCallback(() => {
    setObstaclePositions((prevPositions) => [
      ...prevPositions,
      { x: Math.random() * (width - OBSTACLE_WIDTH), y: -OBSTACLE_HEIGHT },
    ]);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!isCountdownPaused) {
        if (countdown > 0) {
          setCountdown((prevCountdown) => prevCountdown - 1);
        } else {
          setScore((prevScore) => prevScore + 1);
          generateObstacle();
        }
      }
    }, 1000);
    return () => clearInterval(gameLoop);
  }, [countdown, isCountdownPaused, generateObstacle]);

  useEffect(() => {
    const movePlayer = () => {
      if (currentDirection && countdown === 0) {
        currentDirection === 'left' ? moveLeft() : moveRight();
      }
    };

    if (currentDirection && countdown === 0 && !isCountdownPaused) {
      const moveInterval = setInterval(movePlayer, 10);
      moveIntervalRef.current = moveInterval;
      return () => clearInterval(moveInterval);
    }
  }, [currentDirection, countdown, isCountdownPaused, moveLeft, moveRight]);

  useEffect(() => {
    const moveObstacle = () => {
      if (generateBlocks) {
        setObstaclePositions((prevPositions) =>
          prevPositions.map((pos) => ({ ...pos, y: pos.y + OBSTACLE_SPEED }))
        );
        checkCollision();
      }
    };

    const obstacleInterval = setInterval(moveObstacle, 10);
    return () => clearInterval(obstacleInterval);
  }, [generateBlocks, checkCollision]);

  useEffect(() => {
    startCountdownAnimations();
  }, []);

  return (
    <View style={styles.container}>
      <FPSCounter fps={fps} />
      <TouchableOpacity onPress={handlePausePress} style={styles.pauseIcon}>
        <Image source={require('./images/pause_icon.png')} style={styles.pauseIconImage} />
      </TouchableOpacity>
      <MovingBackground />
      {isPaused && (
        <View style={styles.overlay}>
          <Text style={styles.pausedText}>Paused</Text>
          <TouchableOpacity onPress={handleResumePress} style={styles.menuItem}>
            <Text style={styles.menuText}>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRestartPress} style={styles.menuItem}>
            <Text style={styles.menuText}>Restart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Settings")} style={styles.menuItem}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMainMenuPress} style={styles.menuItem}>
            <Text style={styles.menuText}>Main Menu</Text>
          </TouchableOpacity>
        </View>
      )}
      {equippedSkin ? (
        <>
          <Image source={skinImages[equippedSkin]} style={[styles.player, { left: playerPosition }]} />
          <Flame playerPosition={playerPosition} />
        </>
      ) : (
        console.log('Equipped skin is null or empty:', equippedSkin),
        <View style={[styles.player, { left: playerPosition }]}></View>
      )}
      {isCountdownPaused && (
        <View style={styles.overlay}>
          <Text style={styles.pausedText}>You died!</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <TouchableOpacity onPress={handleRestartPress} style={styles.menuItem}>
            <Text style={styles.menuText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleMainMenuPress}>
            <Text style={styles.menuText}>Main Menu</Text>
          </TouchableOpacity>
        </View>
      )}
      {showScorePopup && (
        <View style={styles.overlay1}>
          <Text style={styles.pausedText}>Save Score?</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={async () => {
              try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                  const { id } = JSON.parse(userData);
                  await sendScoreToPHP(id, score);
                } else {
                  console.warn('User data not found in AsyncStorage. Skipping score sending.');
                }
              } catch (error) {
                console.error('Error retrieving user data from AsyncStorage:', error.message);
              }
              setShowScorePopup(false);
            }}
          >
            <Text style={styles.menuText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowScorePopup(false)}
          >
            <Text style={styles.menuText}>No</Text>
          </TouchableOpacity>
        </View>
      )}
      {obstaclePositions.map((obstacle, index) => (
        <View key={index} style={[styles.obstacle, { left: obstacle.x, top: obstacle.y }]}></View>
      ))}
      <View style={styles.arrowContainer}>
        <TouchableOpacity
          onPressIn={() => handlePress('left')}
          onPressOut={handleRelease}
        >
          <Image source={require('./images/arrow_left.png')} style={styles.arrowImage} />
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() => handlePress('right')}
          onPressOut={handleRelease}
        >
          <Image source={require('./images/arrow_right.png')} style={styles.arrowImage} />
        </TouchableOpacity>
      </View>
      {!isCountdownPaused && (
        <View style={styles.countdownContainer}>
          {countdownAnimations.map((anim, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.countdown,
                {
                  transform: [{ translateY: anim }],
                },
              ]}
            >
              {COUNTDOWN_DURATION - index}
            </Animated.Text>
          ))}
        </View>
      )}
      {countdown === 0 && (
        <Text style={styles.score}>{score}</Text>
      )}
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
  fpsCounter: {
    position: 'absolute',
    top: 35,
    right: 25,
    zIndex: 10,
  },
  fpsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  player: {
    position: 'absolute',
    bottom: 175,
    width: 50,
    height: 50,
    backgroundColor: 'red',
  },
  obstacle: {
    position: 'absolute',
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
    backgroundColor: 'green',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  arrowImage: {
    width: 65,
    height: 65,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: 35,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
  },
  countdown: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 11,
  },
  pauseIcon: {
    position: 'absolute',
    top: 35,
    left: 25,
    zIndex: 10,
  },
  pauseIconImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(120, 120, 120, 0.8)',
    width: '75%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '12.5%',
    top: '25%',
    borderRadius: 20,
    zIndex: 10,
  },
  overlay1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(120, 120, 120, 0.8)',
    width: '75%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '12.5%',
    top: '25%',
    borderRadius: 20,
    zIndex: 10,
  },
  menuItem: {
    backgroundColor: 'white',
    width: 150,
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  pausedText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
});

export default Game;

