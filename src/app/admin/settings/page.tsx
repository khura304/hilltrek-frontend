import AdminSettingsForm from "@/components/features/AdminSettingsForm";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Site Settings</h1>
                    <p className="text-gray-400 mt-2">Manage global website configuration and content.</p>
                </div>
            </div>

            <AdminSettingsForm />
        </div>
    );
}
