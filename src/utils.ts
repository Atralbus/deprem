export const getDateWithoutOffset = (date: number) => {
  const dt = new Date(date);
  return new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
};
