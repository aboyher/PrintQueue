// Generates simple PNG icons using SVG → Canvas
// Run: node scripts/generate-icons.js
// For now, create placeholder SVG files

const fs = require("fs");

function createSvgIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#4f46e5"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="${size * 0.5}" font-family="system-ui">🖨️</text>
</svg>`;
}

fs.writeFileSync("public/icon-192.svg", createSvgIcon(192));
fs.writeFileSync("public/icon-512.svg", createSvgIcon(512));

// Also create a simple favicon
fs.writeFileSync(
  "public/favicon.ico",
  "" // Placeholder - browsers will fallback to default
);

console.log("Icons generated (SVG). For production, convert to PNG.");
