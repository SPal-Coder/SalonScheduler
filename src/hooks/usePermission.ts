import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const usePermission = (perm: string) => {
  const permissions = useSelector((s: RootState) => s.permission?.permissions);
  return permissions?.includes(perm);
};