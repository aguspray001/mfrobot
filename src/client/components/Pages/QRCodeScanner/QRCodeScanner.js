import React, { useState } from 'react';
import QRReader from 'react-qr-scanner';
import { useNavigate } from 'react-router-dom';

const QRCodeScanner = () => {
  const [qrResult, setQrResult] = useState(null);
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data !== null) {
      setQrResult(data.text);
      navigate('/');
    }
  };

  const handleError = (err) => {
    console.log(err);
  };

  return (
    <div>
      {qrResult === null ? (
        <>
          <QRReader
            delay={2000}
            style={{ height: 240, width: 320 }}
            onError={handleError}
            onScan={handleScan}
          />
        </>
      ) : (
        <>
          <p>Scan Berhasil</p>
          <p>ini hasilnya: {qrResult}</p>
        </>
      )}
    </div>
  );
};

export default QRCodeScanner;
