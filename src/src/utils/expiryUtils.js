// This is the file which contains the logic for expiry
export const isExpired = (dateString) => {
  const today = new Date();
  const expiryDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  return expiryDate < today;
};
