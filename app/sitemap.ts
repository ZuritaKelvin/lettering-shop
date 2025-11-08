import { MetadataRoute } from 'next'
import { getSupabaseServerClient } from '@/supabase/src/clients/server-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const supabase = getSupabaseServerClient()
  
  // Fetch products for dynamic URLs
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
  
  const productUrls = products?.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...productUrls,
  ]
}
