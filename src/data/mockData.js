export const mockData = {
  currentUser: {
    id: 'u1',
    name: 'Sarah(Manager)',
    role: 'assistant',
    permissions: ['appt.read', 'appt.move','appt.create', 'staff.read']
  },

  config:{
    shopOpenTime: '09:00',
    shopCloseTime: '17:00',
    slotInterval: 30
  },

  stylists: [
    { id: 's1', name: 'John Doe', color: '#FF5733' },
    { id: 's2', name: 'Jane Smith', color: '#33FF57' }
  ],

  appointments: [
    {
      id: 'a1',
      stylistId: 's1',
      clientName: 'Alice',
      start: '2023-10-27T09:00:00',
      end: '2023-10-27T10:00:00',
      status: 'confirmed'
    },
    {
      id: 'a2',
      stylistId: 's2',
      clientName: 'Bob',
      start: '2023-10-27T10:30:00',
      end: '2023-10-27T11:00:00',
      status: 'pending'
    },
        {
      id: 'a3',
      stylistId: 's1',
      clientName: 'jerry',
      start: '2023-10-27T12:30:00',
      end: '2023-10-27T13:00:00',
      status: 'pending'
    }
  ]
};