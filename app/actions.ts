"use server";

export async function getHomeLogos() {
  // In Vercel Production, fs.readdirSync on the 'public' folder doesn't work 
  // reliably in Serverless Functions without explicit trace configurations. 
  // Hardcoding the array is the most robust and performant solution for static assets.
  return [
    "Apple Developer Academy.png",
    "Bank Indonesia.png",
    "BSI Scholarship.png",
    "CBP Rupiah.png",
    "PT Asuransi Kredit Indonesia.png",
    "Startup Campus.png"
  ];
}
