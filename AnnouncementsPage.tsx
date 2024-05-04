import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import AnnouncementItem from './AnnouncementItem';

export default function AnnouncementsPage() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
        <Text style={{fontSize:36, alignSelf: 'center'}}>Announcements</Text>
        <ScrollView>
          <AnnouncementItem />
        </ScrollView>
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

