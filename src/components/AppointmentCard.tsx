import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppointmentCard = React.memo(({ appt }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{appt.clientName}</Text>
    </View>
  );
});

export default AppointmentCard;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title:{ fontSize: 16, fontWeight: 'bold',color: '#fff',textAlign:'center' }

});