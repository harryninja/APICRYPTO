
const sendBackInfo = (request) => {
  const { clientId, address, privateKey } = request.params
  const allInfo = {
    clientId: clientId,
    address: address,
    privateKey: privateKey,
    message: "Webhook received you request and was validated"
  }
  return allInfo
};

module.exports = {
  sendBackInfo,
};
