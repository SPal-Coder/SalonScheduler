export const generateSlots = (open: string, close: string, interval: number) => {
  const slots: string[] = [];
  let [h, m] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);

  while (h < ch || (h === ch && m <= cm)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    m += interval;
    if (m >= 60) {
      h += Math.floor(m / 60);
      m = m % 60;
    }
  }
  return slots;
};