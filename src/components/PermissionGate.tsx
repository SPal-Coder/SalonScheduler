import React from 'react';
import { usePermission } from '../hooks/usePermission';

const PermissionGate = ({ permission, children }: any) => {
  const allowed = usePermission(permission);
  if (!allowed) return null;
  return children;
};

export default PermissionGate;