export const getExpirationTime = {
  days: (totalDays: number) => {
    return totalDays * 24 * 60 * 60 * 1000;
  },
};
