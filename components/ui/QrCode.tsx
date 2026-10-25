"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QrCode({ value, size = 160, className = "" }: {
  value: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`inline-block bg-white ${className}`}>
      <QRCodeSVG value={value} size={size} level="M" boostLevel={false} marginSize={4}
        fgColor="#000000" bgColor="#ffffff" title="Escanea para seguir tu pedido" />
    </div>
  );
}
