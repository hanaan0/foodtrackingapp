export const shouldScheduleNotification = (expiryDate, daysBefore = 1) => {
  const now = new Date();
  const oneDayTrigger = new Date(expiryDate); 
  oneDayTrigger.setDate(oneDayTrigger.getDate() - daysBefore);
  oneDayTrigger.setHours(9, 0, 0, 0);

  return target > now;
};
