import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.apoiêfy.com.br';

    const supabase = await createClient();

    // Fetch all active raffles to include in the sitemap
    const { data: raffles } = await supabase
        .from('raffles')
        .select('slug, updated_at')
        .eq('status', 'active');

    const campgainsUrls: MetadataRoute.Sitemap = (raffles || []).map((raffle) => ({
        url: `${baseUrl}/campanha/${raffle.slug}`,
        lastModified: new Date(raffle.updated_at || new Date()).toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/termos`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacidade`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        ...campgainsUrls,
    ];
}
