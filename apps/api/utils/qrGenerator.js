import QRCode from 'qrcode';

export const generateHealthCardQR = async (patientId) => {
  const url = `${process.env.CLIENT_URL || ''}/patient/${patientId}`;
  const dataUrl = await QRCode.toDataURL(url);
  return dataUrl; // base64 image
};