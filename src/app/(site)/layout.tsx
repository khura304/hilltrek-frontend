import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClientLayoutWrapper>
            {children}
        </ClientLayoutWrapper>
    );
}
