"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, HelpCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
}

interface FAQProps {
    page?: string;
}

export default function FAQ({ page }: FAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const url = page ? `/faqs?page=${page}` : '/faqs';
                const response = await api.get(url);
                setFaqs(response.data);
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, [page]);

    if (loading) {
        return (
            <section className="py-12 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </section>
        );
    }

    if (faqs.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
                        <HelpCircle size={14} />
                        Common Questions
                    </div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`bg-secondary/50 border ${openIndex === idx ? 'border-primary/50 bg-secondary' : 'border-white/5'} rounded-3xl overflow-hidden transition-all duration-300`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                            >
                                <span className="text-lg font-bold text-white pr-8">{faq.question}</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${openIndex === idx ? 'bg-primary border-primary text-white' : 'border-white/20 text-gray-500'}`}>
                                    {openIndex === idx ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                                </div>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 md:p-8 pt-0 text-gray-400 font-medium leading-relaxed border-t border-white/5">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
