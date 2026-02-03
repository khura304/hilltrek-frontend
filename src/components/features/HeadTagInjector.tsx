"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface HeadInjection {
    id: string;
    name: string;
    tags: string;
    pages: string[]; // slugs
}

interface HeadTagInjectorProps {
    injections: string; // JSON string of HeadInjection[]
}

export default function HeadTagInjector({ injections }: HeadTagInjectorProps) {
    const pathname = usePathname();
    const [matchingTags, setMatchingTags] = useState<string>("");

    useEffect(() => {
        if (!injections) {
            setMatchingTags("");
            return;
        }

        try {
            const list: HeadInjection[] = JSON.parse(injections);
            const currentSlug = pathname === "/" ? "home" : pathname.replace(/^\//, "");

            const activeTags = list
                .filter(inj => inj.pages.includes(currentSlug))
                .map(inj => inj.tags)
                .join("\n");

            setMatchingTags(activeTags);
        } catch (e) {
            console.error("Failed to parse custom_head_injections:", e);
            setMatchingTags("");
        }
    }, [pathname, injections]);

    useEffect(() => {
        if (!matchingTags) return;

        // Create a container to parse the cumulative HTML string
        const container = document.createElement('div');
        container.innerHTML = matchingTags;
        const injectedElements: Element[] = [];

        // Move elements to head
        Array.from(container.children).forEach(child => {
            const element = child.cloneNode(true) as Element;
            document.head.appendChild(element);
            injectedElements.push(element);
        });

        // Cleanup function
        return () => {
            injectedElements.forEach(el => {
                if (document.head.contains(el)) {
                    document.head.removeChild(el);
                }
            });
        };
    }, [matchingTags]);

    return null;
}
