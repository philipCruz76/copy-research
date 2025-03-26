"use client";

import { useEffect, useState } from "react";

interface SvgIconProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function SvgIcon({
  src,
  alt,
  width = 20,
  height = 20,
  className = "",
}: SvgIconProps) {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(src);
        const svgText = await response.text();

        // Process the SVG to add currentColor
        let processedSvg = svgText
          // Add fill="currentColor" to SVG elements that don't have a fill attribute
          .replace(/<svg([^>]*)>/g, (match, attributes) => {
            if (!attributes.includes("fill=")) {
              return `<svg${attributes} fill="currentColor">`;
            }
            return match;
          })
          // Replace any fill that isn't none or currentColor with currentColor
          .replace(
            /fill="(?!none|currentColor)([^"]*?)"/g,
            'fill="currentColor"',
          )
          // Replace any stroke that isn't none or currentColor with currentColor
          .replace(
            /stroke="(?!none|currentColor)([^"]*?)"/g,
            'stroke="currentColor"',
          )
          // Remove any id attributes to prevent conflicts
          .replace(/id="[^"]*"/g, "");

        setSvgContent(processedSvg);
      } catch (error) {
        console.error("Error loading SVG:", error);
      }
    };

    fetchSvg();
  }, [src]);

  return (
    <div
      className={className}
      style={{ width: `${width}px`, height: `${height}px` }}
      aria-label={alt}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
