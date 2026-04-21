import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  PanResponder,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateAppointment, addAppointment } from '../store/appointmentSlice';
import { mockData } from '../data/mockData';
import { generateSlots } from '../utils/timeUtils';
import { usePermission } from '../hooks/usePermission';
import { SafeAreaView } from 'react-native-safe-area-context';
import PermissionPanel from '../components/PermissionPanel';

const CELL_HEIGHT = 60;
const COLUMN_WIDTH = 120;

export default function SchedulerScreen() {
  const dispatch = useDispatch();
  const appointments = useSelector((s: RootState) => s.appointments);

  const canMove = usePermission('appt.move');
  const canCreate = usePermission('appt.create');
  const canRead = usePermission('appt.read');

  const { stylists, config } = mockData;


  const slots = useMemo(
    () =>
      generateSlots(
        config.shopOpenTime,
        config.shopCloseTime,
        config.slotInterval,
      ),
    []
  );


  const formatTime = (date: string) => {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(
      d.getMinutes()
    ).padStart(2, '0')}`;
  };

  const getIndex = useCallback(
    (time: string) => slots.indexOf(formatTime(time)),
    [slots]
  );

  const getDuration = useCallback(
    (s: string, e: string) =>
      (new Date(e).getTime() - new Date(s).getTime()) /
      (1000 * 60 * config.slotInterval),
    []
  );


  const hasConflict = useCallback(
    (updated: any) => {
      const newStart = new Date(updated.start).getTime();
      const newEnd = new Date(updated.end).getTime();

      return appointments.some(a => {
        if (a.id === updated.id) return false;
        if (a.stylistId !== updated.stylistId) return false;

        const start = new Date(a.start).getTime();
        const end = new Date(a.end).getTime();

        return newStart < end && newEnd > start;
      });
    },
    [appointments]
  );


  const groupedAppointments = useMemo(() => {
    const map: any = {};
    stylists.forEach(s => (map[s.id] = []));
    appointments.forEach(a => map[a.stylistId].push(a));
    return map;
  }, [appointments]);

  const slotMap = useMemo(() => {
    const map: any = {};

    appointments.forEach(a => {
      let current = new Date(a.start).getTime();
      const end = new Date(a.end).getTime();

      while (current < end) {
        const d = new Date(current);
        const key = `${a.stylistId}-${String(d.getHours()).padStart(
          2,
          '0'
        )}:${String(d.getMinutes()).padStart(2, '0')}`;

        map[key] = true;
        current += config.slotInterval * 60000;
      }
    });

    return map;
  }, [appointments]);

  const createPan = useCallback(
    (appt: any) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => canMove,

        onPanResponderRelease: (_, g) => {
          if (!canMove) return;

          const moveY = Math.round(g.dy / CELL_HEIGHT);
          const moveX = Math.round(g.dx / COLUMN_WIDTH);

          const start = new Date(appt.start);
          const end = new Date(appt.end);

          start.setMinutes(start.getMinutes() + moveY * config.slotInterval);
          end.setMinutes(end.getMinutes() + moveY * config.slotInterval);

          let idx =
            stylists.findIndex(s => s.id === appt.stylistId) + moveX;

          if (idx < 0 || idx >= stylists.length) return;

          const updated = {
            ...appt,
            stylistId: stylists[idx].id,
            start: start.toISOString(),
            end: end.toISOString(),
          };

          if (hasConflict(updated)) {
            Alert.alert('Conflict Detected', 'Slot already booked');
            return;
          }

          dispatch(updateAppointment(updated));
        },
      }),
    [appointments, canMove]
  );

  const handleCreate = () => {
    if (!canCreate) return;

    const newAppt = {
      id: Date.now().toString(),
      stylistId: stylists[0].id,
      clientName: 'Harry',
      start: '2023-10-27T13:00:00',
      end: '2023-10-27T13:30:00',
      status: 'confirmed',
    };

    if (hasConflict(newAppt)) {
      Alert.alert('Conflict', 'Cannot create');
      return;
    }

    dispatch(addAppointment(newAppt));
  };

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:'#fff' }}>
        <PermissionPanel />
      {canCreate && (
        <TouchableOpacity onPress={handleCreate} style={styles.btn}>
          <Text style={styles.btnText}>Add Slot</Text>
        </TouchableOpacity>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator>
      <ScrollView showsVerticalScrollIndicator={false} >
        <View>

          {/* HEADER */}
          <View style={styles.row}>
            <View style={styles.timeCol} />
            {canRead &&
              stylists.map(s => (
                <View key={s.id} style={styles.headerCell}>
                  <Text style={styles.headerText}>{s.name}</Text>
                </View>
              ))}
          </View>

          {/* BODY */}
          <View style={styles.row}>

            {/* TIME COLUMN */}
            <View style={styles.timeCol}>
              {slots.map(t => (
                <View key={t} style={styles.cell}>
                  <Text style={{ fontSize: 12 ,color:'#000',fontWeight:'bold'}}>{t}</Text>
                </View>
              ))}
            </View>

            {/* STYLIST COLUMNS */}
            {canRead &&
              stylists.map(stylist => (
                <View key={stylist.id} style={styles.col}>

                  {/* GRID */}
                  {slots.map(slot => {
                    const key = `${stylist.id}-${slot}`;
                    const isBooked = slotMap[key];

                    return (
                      <View key={slot} style={styles.cell}>
                        {!isBooked && (
                          <Text style={styles.emptyText}>Empty Slot</Text>
                        )}
                      </View>
                    );
                  })}

                  {/* APPOINTMENTS */}
                  {groupedAppointments[stylist.id]?.map((appt: any) => {
                    const pan = createPan(appt);

                    return (
                      <View
                        key={appt.id}
                        {...pan.panHandlers}
                        style={{
                          position: 'absolute',
                          top: getIndex(appt.start) * CELL_HEIGHT,
                          height:
                            getDuration(appt.start, appt.end) * CELL_HEIGHT,
                          left: 5,
                          right: 5,
                          backgroundColor: stylist.color,
                          borderRadius: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: '#fff' }}>
                          {appt.clientName}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
          </View>

        </View>
      </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  timeCol: { width: 70 },
  col: { width: 120, borderLeftWidth: 1 },
  headerCell: {
    width: 120,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerText: { fontWeight: 'bold',color:'#000' },
  cell: {
    height: CELL_HEIGHT,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'black',
    padding: 10,
    width:'50%',
    alignSelf:'center',
    borderRadius:10,
    marginTop:10
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 10,
    color: '#aaa',
  },
});