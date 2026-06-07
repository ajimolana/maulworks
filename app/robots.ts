import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // Update this with your actual domain later
    sitemap: 'https://maulworks.vercel.app/sitemap.xml',
  }
}
