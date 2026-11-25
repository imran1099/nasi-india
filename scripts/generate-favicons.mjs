import sharp from "sharp";
import fs from "fs";
import path from "path";

async function generateFavicons() {
  const sourceImage = path.resolve("public/uploads/general/img-20261110-wa0080-b3d7704c9b213c51be5bd5a0.jpg");
  if (!fs.existsSync(sourceImage)) {
    throw new Error(`Source image not found: ${sourceImage}`);
  }

  console.log("Generating favicons from:", sourceImage);

  // 1. Generate PNGs
  const sizes = [
    { name: "public/favicon-16x16.png", size: 16 },
    { name: "public/favicon-32x32.png", size: 32 },
    { name: "public/favicon-48x48.png", size: 48 },
    { name: "public/apple-touch-icon.png", size: 180 },
    { name: "src/app/apple-icon.png", size: 180 },
    { name: "public/android-chrome-192x192.png", size: 192 },
    { name: "public/android-chrome-512x512.png", size: 512 },
    { name: "src/app/icon.png", size: 512 },
  ];

  for (const { name, size } of sizes) {
    const dir = path.dirname(name);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await sharp(sourceImage)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(name);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // 2. Generate a valid multi-resolution ICO file (containing 16x16, 32x32, 48x48 PNG frames)
  const png16 = await sharp(sourceImage).resize(16, 16).png().toBuffer();
  const png32 = await sharp(sourceImage).resize(32, 32).png().toBuffer();
  const png48 = await sharp(sourceImage).resize(48, 48).png().toBuffer();

  const icoBuffers = [
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 },
  ];

  // ICO header: 2 bytes reserved (0), 2 bytes type (1 for ICO), 2 bytes count (3)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(icoBuffers.length, 4);

  let offset = 6 + icoBuffers.length * 16;
  const directoryEntries = [];
  const imageBuffers = [];

  for (const img of icoBuffers) {
    const dirEntry = Buffer.alloc(16);
    dirEntry.writeUInt8(img.size, 0); // width
    dirEntry.writeUInt8(img.size, 1); // height
    dirEntry.writeUInt8(0, 2); // color palette
    dirEntry.writeUInt8(0, 3); // reserved
    dirEntry.writeUInt16LE(1, 4); // color planes
    dirEntry.writeUInt16LE(32, 6); // bits per pixel
    dirEntry.writeUInt32LE(img.buffer.length, 8); // size of image data
    dirEntry.writeUInt32LE(offset, 12); // offset of image data

    directoryEntries.push(dirEntry);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  const finalIco = Buffer.concat([header, ...directoryEntries, ...imageBuffers]);
  fs.writeFileSync("public/favicon.ico", finalIco);
  fs.writeFileSync("src/app/favicon.ico", finalIco);
  console.log("Generated public/favicon.ico and src/app/favicon.ico (multi-resolution 16, 32, 48)");

  // 3. Create site.webmanifest
  const manifest = {
    name: "NATIONAL ASSOCIATION SOROPTIMIST INDIA (NASI-India)",
    short_name: "NASI-India",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#005596",
    background_color: "#ffffff",
    display: "standalone",
  };
  fs.writeFileSync("public/site.webmanifest", JSON.stringify(manifest, null, 2));
  console.log("Generated public/site.webmanifest");
}

generateFavicons().catch(console.error);
