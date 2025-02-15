export const getExpirationTime = {
  days: (totalDays: number) => totalDays * 24 * 60 * 60 * 1000,
  minutes: (totalMinutes: number) => totalMinutes * 60 * 1000,
};
