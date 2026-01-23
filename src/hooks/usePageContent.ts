import { useState, useEffect } from 'react';
import { getPageContent, PageContent } from '@/lib/api';

export function usePageContent(slug: string) {
    const [page, setPage] = useState<PageContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data = await getPageContent(slug);
                setPage(data);
            } catch (error) {
                console.error(`Failed to fetch page content for ${slug}:`, error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPage();
        }
    }, [slug]);

    return { page, loading };
}
