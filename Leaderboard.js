import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import SideBar from './SideBar'; // Import the modified SideBar component

const Leaderboard = () => {
  const navigation = useNavigation();
  const [isAllTime, setIsAllTime] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        let apiUrl = 'http://192.168.46.184/speeliite/get_all_time_leaderboard.php';
        if (!isAllTime) {
          const userData = await AsyncStorage.getItem('userData');
          if (!userData) {
            throw new Error('User data not found in AsyncStorage');
          }
          const { id } = JSON.parse(userData);
          apiUrl = `http://192.168.46.184/speeliite/get_personal_leaderboard.php?userId=${id}`;
        }
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, [isAllTime]);

  const toggleLeaderboard = () => {
    setIsAllTime(!isAllTime);
  };

  const formatDate = (dateString) => {
    // Parse the date string
    const date = new Date(dateString);
    // Format the date without the time
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.leaderboardContainer}>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={[
                styles.sliderButton,
                isAllTime ? styles.activeButton : styles.inactiveButton,
              ]}
              onPress={() => toggleLeaderboard()}
            >
              <Text style={styles.sliderText}>All Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sliderButton,
                !isAllTime ? styles.activeButton : styles.inactiveButton,
              ]}
              onPress={() => toggleLeaderboard()}
            >
              <Text style={styles.sliderText}>Personal</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.leaderboardBox}>
            <Text style={styles.leaderboardTitle}>
              {isAllTime ? 'All Time Leaderboard' : 'Personal Leaderboard'}
            </Text>
            <ScrollView style={styles.tableContainer}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Rank</Text>
                  <Text style={styles.tableHeaderText}>Username</Text>
                  <Text style={styles.tableHeaderText}>Score</Text>
                  <Text style={styles.tableHeaderText}>Date</Text> 
                </View>
                {leaderboardData.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{item.username}</Text>
                    <Text style={styles.tableCell}>{item.score}</Text>
                    <Text style={styles.tableCell}>{formatDate(item.game_date)}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
        <SideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          style={styles.sideBar} // Add this style prop
        />
      </ScrollView>
      <TouchableOpacity onPress={() => setSidebarOpen(!sidebarOpen)} style={styles.burgerIcon}>
        <Image source={require('./images/burger_menu.png')} style={styles.burgerMenuIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  leaderboardContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  sliderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: 'green',
  },
  inactiveButton: {
    backgroundColor: 'grey',
  },
  sliderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  leaderboardBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    maxHeight: 400,
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  tableContainer: {
    width: '100%',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
  },
  sideBar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  burgerIcon: {
    position: 'absolute',
    top: 30,
    left: 30,
  },
  burgerMenuIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default Leaderboard;
