import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QRScanner({ onScan, onStart }) {
  const scannerRef = useRef(null)
  const divId = 'qr-reader'

  useEffect(() => {
    const scanner = new Html5Qrcode(divId)
    scannerRef.current = scanner

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        scanner.stop().catch(() => {})
        onScan(decodedText)
      }
    ).then(() => onStart?.()).catch(console.error)

    return () => {
      scanner.isScanning && scanner.stop().catch(() => {})
    }
  }, [])

  return (
    <div className="rounded-xl overflow-hidden bg-black">
      <div id={divId} className="w-full" />
    </div>
  )
}
