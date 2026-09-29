"use server";

import fs from "fs";
import path from "path";

export async function getHomeLogos() {
  try {
    const dir = path.join(process.cwd(), "public/assets/homeLogos");
    if (!fs.existsSync(dir)) return [];
    
    const files = fs.readdirSync(dir);
    // Return only image files
    return files.filter(f => /\.(png|jpe?g|svg|gif|webp)$/i.test(f));
  } catch (error) {
    console.error("Failed to read home logos directory:", error);
    return [];
  }
}
