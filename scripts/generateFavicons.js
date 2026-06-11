#!/usr/bin/env node
/**
 * Generate the favicon / app-icon set from the SwiftHerb logo.
 * Crops the round leaf mark out of the horizontal lockup and emits:
 *   app/icon.png        (512, transparent)  -> Next auto <link rel="icon">
 *   app/apple-icon.png  (180, white bg)     -> Next auto apple-touch-icon
 *   app/favicon.ico     (48, embedded PNG)  -> /favicon.ico for legacy/crawlers
 *   public/icon-192.png, public/icon-512.png -> web manifest (Android/PWA)
 *
 * Usage: node scripts/generateFavicons.js
 */
const fs = require("fs");
const path = require("path");

// sharp is a transitive dep (not hoisted); resolve it from the pnpm store.
const sharpDir = path.join(__dirname, "..", "node_modules", ".pnpm", "sharp@0.34.5", "node_modules", "sharp");
const sharp = require(sharpDir);

const SRC = path.join(__dirname, "..", "images-src-logo.png");
const LOGO = fs.existsSync(SRC) ? SRC : path.join(__dirname, "..", "public", "images", "swiftherb-logo.png");
const APP = path.join(__dirname, "..", "app");
const PUBLIC = path.join(__dirname, "..", "public");

// The leaf-in-circle mark occupies the left square of the 379x139 lockup.
const MARK = { left: 0, top: 0, width: 139, height: 139 };
const GREEN = { r: 255, g: 255, b: 255, alpha: 1 }; // white plate for iOS (no alpha)

function markBuffer() {
  return sharp(LOGO).extract(MARK).png().toBuffer();
}

async function pngFromMark(size, background) {
  const mark = await markBuffer();
  let img = sharp(mark).resize(size, size, {
    fit: "contain",
    background: background || { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (background) img = img.flatten({ background });
  return img.png().toBuffer();
}

/** Wrap a PNG buffer in a single-image .ico container (PNG-in-ICO, Vista+). */
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // image size
  entry.writeUInt32LE(header.length + entry.length, 12); // offset
  return Buffer.concat([header, entry, png]);
}

(async () => {
  fs.writeFileSync(path.join(APP, "icon.png"), await pngFromMark(512));
  fs.writeFileSync(path.join(APP, "apple-icon.png"), await pngFromMark(180, GREEN));
  fs.writeFileSync(path.join(APP, "favicon.ico"), pngToIco(await pngFromMark(48), 48));
  fs.writeFileSync(path.join(PUBLIC, "icon-192.png"), await pngFromMark(192));
  fs.writeFileSync(path.join(PUBLIC, "icon-512.png"), await pngFromMark(512));
  console.log("[favicons] wrote app/icon.png, app/apple-icon.png, app/favicon.ico, public/icon-{192,512}.png");
})().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
