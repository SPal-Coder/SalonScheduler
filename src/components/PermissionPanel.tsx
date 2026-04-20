import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { togglePermission } from '../store/permissionSlice';
import { RootState } from '../store/store';

// Label Mapping
const PERMISSION_LABELS: Record<string, string> = {
  'appt.read': 'Read',
  'appt.move': 'Move',
  'appt.create': 'Create',
  'staff.read': 'Staff Read',
};

const ALL_PERMISSIONS = [
  'appt.read',
  'appt.move',
  'appt.create',
  'staff.read',
];

export default function PermissionPanel() {
  const dispatch = useDispatch<any>();

  const activePerms = useSelector(
    (s: RootState) => s.permission?.permissions || []
  );

  return (
    <View style={{ padding: 10, backgroundColor: '#eee' }}>
      <Text style={{ fontWeight: 'bold' }}>Permissions</Text>

      {ALL_PERMISSIONS.map(p => {
        const active = activePerms.includes(p);

        return (
          <TouchableOpacity
            key={p}
            onPress={() => dispatch(togglePermission(p))}
            style={{
              marginVertical: 5,
              padding: 8,
              backgroundColor: active ? 'green' : 'gray',
              borderRadius: 5,
            }}
          >
            <Text style={{ color: '#fff' }}>
              {PERMISSION_LABELS[p] || p} {active ? '✅' : '❌'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}