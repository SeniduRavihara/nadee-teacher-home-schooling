import { syllabusData } from '@/data/syllabus'
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://nadeeteacher.online',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://nadeeteacher.online/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://nadeeteacher.online/signup',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...Object.keys(syllabusData).map((grade): MetadataRoute.Sitemap[number] => ({
      url: `https://nadeeteacher.online/classes/${grade}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })),
  ]
}
