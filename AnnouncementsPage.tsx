import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const AnnouncementsPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
        <Text style={{fontSize:36, alignSelf: 'center'}}>Announcements</Text>
      </SafeAreaView>
      <StatusBar style="auto"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnnouncementsPage;
