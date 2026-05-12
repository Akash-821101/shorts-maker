"use client";

import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * BrandLogo component
 * Switch src to:
 * - /brand_logo_minimal.svg
 * - /brand_logo_v2.svg
 * - /brand_logo_v3.svg
 * - /brand_logo_v4.svg
 * - /brand_logo_v5.svg
 */
export function BrandLogo({ className = "", size = 32, showText = true }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <Image
          src="/brand_logo_v2.svg"
          alt="Shorts-Maker Logo"
          width={size}
          height={size}
          className="transition-transform duration-300 hover:scale-110"
          priority
        />
      </div>
      {showText && (
        <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500">
          Shorts-Maker
        </span>
      )}
    </div>
  );
}
