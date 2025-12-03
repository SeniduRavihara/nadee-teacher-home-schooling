import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/student/'],
    },
    sitemap: 'https://nadeeteacher.com/sitemap.xml',
  }
}
