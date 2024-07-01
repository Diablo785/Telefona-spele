import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Importē attēlus no vietējā projekta mapes
import logo from './images/logo.png';
import ceo from './images/ceo.png';
import junior from './images/junior.png';
import senior from './images/senior.png';

const TeamMember = ({ image, title, name }) => (
  <View style={styles.member}>
    <Image source={image} style={styles.image} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.name}>{name}</Text>
  </View>
);

const Info = () => (
  <View style={styles.container}>
    <Image source={logo} style={styles.logo} />
    <Text style={styles.text}>OUR TEAM</Text>
    <View style={styles.team}>
      <TeamMember image={ceo} title="FOUNDER AKA CEO OF VALTERS CO" name="VALTERS" />
      <TeamMember image={senior} title="SENIOR DEVELOPER PROGAMERS AKA" name="IMKA" />
      <TeamMember image={junior} title="JUNIOR DEVELOPER" name="OLEGS" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start', // Maina izkārtojumu, lai sāktu no augšas
    paddingTop: 50, // Pievieno atstarpi virs konteinera
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 10, // Samazina atstarpes apakšu zem logotipa
    marginTop: 60,
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50, // Samazina atstarpes augšu virs teksta
  },
  team: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  member: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  title: {
    color: 'white',
    fontSize: 5, // Samazina nosaukuma fonta izmēru
    marginTop: 10, // Pievieno atstarpi virs nosaukuma
  },
  name: {
    color: 'white',
    fontSize: 10, // Samazina vārda fonta izmēru
  },
});

export default Info;
