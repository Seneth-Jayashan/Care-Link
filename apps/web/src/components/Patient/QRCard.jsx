import QRCode from 'qrcode.react';

export default function QRCard({ patient }) {
  const qrValue = JSON.stringify({ id: patient._id, name: patient.fullName });
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="font-bold mb-2">{patient.fullName}</h3>
      <QRCode value={qrValue} size={128} />
    </div>
  );
}
