"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

export default function QRScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText: string) => {
          // QR code successfully scanned
          console.log("Scanned:", decodedText);
          stopScanning();
          setIsOpen(false);
          
          // Navigate to product page with scanned code
          router.push(`/product/${decodedText}`);
        },
        (errorMessage: string) => {
          // Ignore scanning errors (they happen continuously while scanning)
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => startScanning(), 100);
  };

  const handleClose = () => {
    stopScanning();
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 w-16 h-16 bg-white text-black rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center border-2 border-white/20 z-50"
        aria-label="Scan QR Code"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      </button>

      {/* Scanner Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <div className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Scan QR Code</h2>
                <button
                  onClick={handleClose}
                  className="text-white/60 hover:text-white transition"
                  aria-label="Close scanner"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div id="qr-reader" className="w-full rounded-lg overflow-hidden"></div>
              
              <p className="text-white/60 text-sm text-center mt-4">
                Point your camera at a QR code to scan
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
