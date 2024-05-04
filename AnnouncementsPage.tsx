import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AnnouncementsPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Announcements Page</Text>
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
