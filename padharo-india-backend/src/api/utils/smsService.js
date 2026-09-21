export const sendSms = async (mobile, message) => {
  console.info(`SMS send simulated for ${mobile}: ${message}`);
  return true;
};
