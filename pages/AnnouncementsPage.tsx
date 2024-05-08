import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import AnnouncementItem from '../Components/AnnouncementItem';
import { api } from '../Constants';
import { useIsFocused } from '@react-navigation/native';

export default function AnnouncementsPage({navigation}) {
  const [announcements, setAnnouncements] = useState([]);
  const isFocused = useIsFocused();

  const getAnnouncementsFromAPI = () => {
    fetch(`${api.address}/getAnnouncements?group=1`, {
      method: 'GET',
    }).then(response => response.json()).then(json => {
      setAnnouncements(json);
    }).catch(error => {
      console.error(error);
    });
  }

  useEffect(() => {
    getAnnouncementsFromAPI();
  }, [isFocused])

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
        <Text style={{fontSize:36, alignSelf: 'center'}}>Announcements</Text>
        <ScrollView>
          {announcements.map((announcement) => {
            return (
              <AnnouncementItem key={announcement.announcements_id} title={announcement.title} contents={announcement.description} />
            );
          })}
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

