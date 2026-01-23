import { getPageContent, PageContent } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function DynamicPage({ params }: PageProps) {
    const { slug } = await params;
    let page: PageContent | null = null;

    try {
        page = await getPageContent(slug);
    } catch (error) {
        // If 404
    }

    if (!page) {
        notFound();
    }

    const blocks = Array.isArray(page.content) ? page.content : [];

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
            {/* Hero */}
            <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
                {page.hero_image ? (
                    <div className="absolute inset-0 z-0">
                        <img src={page.hero_image} alt={page.hero_title} className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    </div>
                ) : (
                    <div className="absolute inset-0 z-0 bg-slate-900 border-b border-white/10"></div>
                )}

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">{page.hero_title || page.title}</h1>
                    {page.hero_subtitle && <p className="text-xl text-gray-300 max-w-2xl mx-auto">{page.hero_subtitle}</p>}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
                {blocks.map((block: any, index: number) => {
                    switch (block.type) {
                        case 'heading':
                            return (
                                <h2 key={index} className="text-3xl font-bold text-white mb-6">
                                    {block.value}
                                </h2>
                            );
                        case 'image':
                            return (
                                <div key={index} className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10">
                                    <img src={block.value} alt="Content Image" className="w-full h-full object-cover" />
                                </div>
                            );
                        case 'text':
                        default:
                            return (
                                <div key={index} className="prose prose-invert prose-lg max-w-none text-gray-300">
                                    <p>{block.value}</p>
                                </div>
                            );
                    }
                })}
            </div>
        </div>
    );
}
