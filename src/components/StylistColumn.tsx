import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppointmentCard from './AppointmentCard';

const CELL_HEIGHT = 60;

const StylistColumn = React.memo(
  ({ stylist, slots, appointments, createPan, getIndex, getDuration }: any) => {

  
    const stylistAppointments = useMemo(() => {
      return appointments.filter((a: any) => a.stylistId === stylist.id);
    }, [appointments, stylist.id]);

    return (
      <View style={styles.column}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{stylist.name}</Text>
        </View>

        <View style={styles.grid}>

          {/* Grid cells */}
          {slots.map((t: string) => (
            <View key={t} style={styles.cell} />
          ))}

          {/* Appointments */}
          {stylistAppointments.map((appt: any) => {
            
          
            const panRef = useRef(createPan(appt)).current;

            const top = getIndex(appt.start) * CELL_HEIGHT;
            const height = getDuration(appt.start, appt.end) * CELL_HEIGHT;

            return (
              <View
                key={appt.id}
                {...panRef.panHandlers}
                style={[
                  styles.appointment,
                  {
                    top,
                    height,
                    backgroundColor: stylist.color
                  }
                ]}
              >
                <AppointmentCard appt={appt} />
              </View>
            );
          })}
        </View>
      </View>
    );
  },

 
  (prev, next) => {
    return (
      prev.stylist.id === next.stylist.id &&
      prev.appointments === next.appointments &&
      prev.slots === next.slots
    );
  }
);

export default StylistColumn;

const styles = StyleSheet.create({
  column: {
    width: 120,
    borderLeftWidth: 1
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee'
  },
  headerText: {
    fontWeight: 'bold'
  },
  grid: {
    flex: 1
  },
  cell: {
    height: CELL_HEIGHT,
    borderBottomWidth: 1
  },
  appointment: {
    position: 'absolute',
    left: 5,
    right: 5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  }
});