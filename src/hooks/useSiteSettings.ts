import { useState, useEffect } from 'react';
import { getSiteSettings, SiteSetting } from '@/lib/api';

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSetting>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSiteSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch site settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading };
}
