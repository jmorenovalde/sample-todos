export function getDateOffset(offset: number): Date {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + offset);
  newDate.setUTCHours(0);
  newDate.setUTCMinutes(0);
  newDate.setUTCSeconds(0);
  newDate.setUTCMilliseconds(0);
  return newDate;
}
