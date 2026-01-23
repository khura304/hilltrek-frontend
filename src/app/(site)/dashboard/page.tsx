"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useNotification } from "@/contexts/NotificationContext";
import {
    Calendar,
    Users,
    DollarSign,
    Clock,
    CheckCircle2,
    XCircle,
    Compass,
    ArrowRight,
    MapPin,
    ShieldCheck,
    Trash2,
    Download
} from "lucide-react";
import api from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DashboardContent() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [paymentLoading, setPaymentLoading] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast, confirm } = useNotification();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (!token || !storedUser) {
                router.push('/login');
                return;
            }

            setUser(JSON.parse(storedUser));

            // Handle Payment Success Return
            const paymentStatus = searchParams.get('payment');
            const bookingId = searchParams.get('booking_id');
            const sessionId = searchParams.get('session_id');

            if (paymentStatus === 'success' && bookingId && sessionId) {
                try {
                    await api.post('/payments/success', {
                        booking_id: bookingId,
                        session_id: sessionId
                    });
                } catch (err) {
                    console.error("Failed to confirm payment:", err);
                }
            }

            try {
                const response = await api.get('/bookings');
                setBookings(response.data);
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [searchParams, router]);

    const handlePayment = async (bookingId: number) => {
        setPaymentLoading(bookingId);
        try {
            const response = await api.post('/payments/create-session', { booking_id: bookingId });
            window.location.href = response.data.url;
        } catch (err) {
            console.error("Payment initiation failed:", err);
            showToast('error', 'Could not start payment. Please try again.');
        } finally {
            setPaymentLoading(null);
        }
    };

    const handleDelete = async (bookingId: number) => {
        confirm(
            "Cancel Booking?",
            "Are you sure you want to cancel and delete this booking? This action cannot be undone.",
            async () => {
                setDeleteLoading(bookingId);
                try {
                    await api.delete(`/bookings/${bookingId}`);
                    setBookings(prev => prev.filter(b => b.id !== bookingId));
                    showToast('success', 'Booking cancelled successfully.');
                } catch (err) {
                    console.error("Failed to delete booking:", err);
                    showToast('error', 'Could not delete booking. The tour may have already started or is completed.');
                } finally {
                    setDeleteLoading(null);
                }
            }
        );
    };

    const handleDownloadInvoice = async (booking: any) => {
        const doc = new jsPDF() as any;

        // Helper to convert image to data URL for embedding
        const getImageDataUrl = async (url: string) => {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        };

        try {
            // Logo
            const logoData = await getImageDataUrl('/logo.png');
            doc.addImage(logoData, 'PNG', 15, 12, 18, 18);
        } catch (err) {
            console.error("Failed to load logo for PDF", err);
        }

        // Header Branding
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // Slate 900
        doc.text("HILLTREK", 38, 22);
        doc.setTextColor(249, 115, 22); // Primary Orange
        doc.text("& TOURS", 78, 22);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("Explore the Great Himalayas with us.", 38, 28);

        // Invoice Label & Detail (Right Aligned)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        doc.setTextColor(240, 240, 240);
        doc.text("INVOICE", 200, 30, { align: 'right' });

        // Information Section
        doc.setDrawColor(249, 115, 22);
        doc.setLineWidth(1.5);
        doc.line(15, 45, 195, 45);

        // Billing Details
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("BILL TO:", 15, 58);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.text(user?.name || "Valued Customer", 15, 64);
        doc.text(user?.email || "", 15, 69);

        // Invoice Details (Right Side)
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("INVOICE DETAILS:", 140, 58);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.text(`Invoice #: HT-${booking.id}`, 140, 64);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 69);
        doc.text(`Status: PAID`, 140, 74);

        // Tour Summary Title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("TOUR BOOKING SUMMARY", 15, 90);

        // Content Table
        const bookingType = booking.tour_id ? 'Tour' : booking.vehicle_id ? 'Vehicle' : 'Accommodation';
        const itemTitle = booking.tour?.title || booking.vehicle?.title || booking.accommodation?.title || "N/A";

        const tableData = [
            [
                { content: `[${bookingType}] ${itemTitle}`, styles: { fontStyle: 'bold' } },
                booking.travel_date || "N/A",
                booking.num_travelers || "N/A",
                `$${(parseFloat(booking.total_price) / booking.num_travelers).toFixed(2)}`,
                `$${booking.total_price}`
            ]
        ];

        autoTable(doc, {
            startY: 95,
            head: [['Description', 'Date', 'Pax', 'Rate', 'Total']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [15, 23, 42],
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                fontSize: 9,
                cellPadding: 6,
                valign: 'middle',
                textColor: [60, 60, 60]
            },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'right' },
                4: { halign: 'right', fontStyle: 'bold', textColor: [249, 115, 22] }
            },
            margin: { left: 15, right: 15 }
        });

        // Traveler Details Section
        const travelerY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("TRAVELER DETAILS", 15, travelerY);

        const travelerTableData = (booking.travelers || []).map((t: any) => [
            t.name,
            t.email || '-',
            t.phone || '-',
            t.passport_number || '-',
            t.age || '-'
        ]);

        autoTable(doc, {
            startY: travelerY + 5,
            head: [['Name', 'Email', 'Phone', 'Passport', 'Age']],
            body: travelerTableData,
            theme: 'striped',
            headStyles: {
                fillColor: [249, 115, 22],
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 8,
                textColor: [80, 80, 80]
            },
            margin: { left: 15, right: 15 }
        });

        // Totals Section
        const finalY = (doc as any).lastAutoTable.finalY + 15;

        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.5);
        doc.line(130, finalY, 195, finalY);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text("Subtotal:", 140, finalY + 10);
        doc.text(`$${booking.total_price}`, 195, finalY + 10, { align: 'right' });

        doc.text("Tax (0%):", 140, finalY + 18);
        doc.text("$0.00", 195, finalY + 18, { align: 'right' });

        doc.setFillColor(249, 115, 22);
        doc.rect(130, finalY + 24, 65, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text("TOTAL PAID:", 135, finalY + 32);
        doc.text(`$${booking.total_price}`, 190, finalY + 32, { align: 'right' });

        // Professional Footer
        const pageHeight = doc.internal.pageSize.height;

        // Background for footer
        doc.setFillColor(250, 250, 250);
        doc.rect(0, pageHeight - 40, 210, 40, 'F');

        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.setFont("helvetica", "bold");
        doc.text("TERMS & CONDITIONS", 15, pageHeight - 30);
        doc.setFont("helvetica", "normal");
        doc.text("1. This is a computer generated invoice and does not require a signature.", 15, pageHeight - 24);
        doc.text("2. Please present a digital or printed copy of this invoice at the time of departure.", 15, pageHeight - 19);

        doc.setTextColor(249, 115, 22);
        doc.setFont("helvetica", "bold");
        doc.text("www.hilltrek.pk | support@hilltrek.pk | +92 300 1234567", 105, pageHeight - 10, { align: 'center' });

        doc.save(`Hilltrek_Invoice_${booking.id}.pdf`);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={14} className="text-yellow-500" />;
            case 'confirmed': return <CheckCircle2 size={14} className="text-green-500" />;
            case 'cancelled': return <XCircle size={14} className="text-red-500" />;
            default: return <Clock size={14} className="text-gray-500" />;
        }
    };

    const stats = {
        totalTrips: bookings.length,
        upcomingTrips: bookings.filter(b => b.status === 'confirmed').length,
        totalSpent: bookings.reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0)
    };

    return (
        <div className="space-y-8">
            {/* Header Section - Same as Profile */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                        <Compass size={10} className="text-primary animate-pulse" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Traveler Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        My <span className="text-primary italic">Trips</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Adventure awaits, <span className="text-white/80">{user?.name}</span> tracking your journey
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 border-dashed">
                    <div className="w-12 h-12 orange-gradient rounded-xl flex items-center justify-center text-white text-xl font-black shadow-orange">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-black text-white tracking-tight leading-none">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.05em] mt-2">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview - Clean 3 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Total Bookings', value: loading ? "..." : stats.totalTrips, icon: <MapPin size={18} /> },
                    { label: 'Confirmed Trips', value: loading ? "..." : stats.upcomingTrips, icon: <ShieldCheck size={18} /> },
                    { label: 'Total Fare', value: loading ? "..." : `$${stats.totalSpent.toLocaleString()}`, icon: <DollarSign size={18} /> }
                ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/10 transition-all border-dashed shadow-xl">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{s.value}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            {s.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 mb-20">
                <section className="bg-secondary/20 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.02] blur-[80px] rounded-full"></div>

                    <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/10">
                                <ShieldCheck size={16} strokeWidth={3} />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Current Bookings</h2>
                        </div>
                        <Link href="/tours" className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest transition-colors">
                            Explore More Tours →
                        </Link>
                    </div>

                    <div className="p-6 md:p-8">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-20 bg-white/5 animate-pulse rounded-xl border border-white/5"></div>
                                ))}
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">No active bookings found</p>
                                <Link href="/tours" className="orange-gradient text-white px-8 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-orange inline-flex items-center gap-2 hover:scale-105 transition">
                                    <span>Browse Tours</span>
                                    <ArrowRight size={14} strokeWidth={3} />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="group relative bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all duration-500 hover:border-primary/20">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="relative w-16 h-16 shrink-0">
                                                <img
                                                    src={booking.tour?.image_url || booking.vehicle?.image_url || booking.accommodation?.image_url || "/images/gallery-naran.jpg"}
                                                    alt=""
                                                    className="w-full h-full rounded-lg object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10"></div>
                                            </div>

                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <MapPin size={9} className="text-primary" />
                                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.15em]">
                                                        {booking.tour?.destination?.name || booking.vehicle?.destination?.name || booking.accommodation?.destination?.name || 'Destination'}
                                                    </span>
                                                </div>
                                                <h3 className="text-md font-black text-white uppercase tracking-tight mb-3 leading-none group-hover:text-primary transition-colors">
                                                    {booking.tour?.title || booking.vehicle?.title || booking.accommodation?.title}
                                                </h3>

                                                <div className="grid grid-cols-3 gap-4 max-w-sm">
                                                    <div>
                                                        <p className="text-[7px] font-black text-gray-600 uppercase tracking-[0.1em] mb-1">Date</p>
                                                        <p className="text-white font-bold text-[13px] tracking-tight">{booking.travel_date}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[7px] font-black text-gray-600 uppercase tracking-[0.1em] mb-1">
                                                            {booking.tour_id ? 'Pax' : booking.vehicle_id ? 'Seats' : 'Guests'}
                                                        </p>
                                                        <p className="text-white font-bold text-[13px] tracking-tight">{booking.num_travelers}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[7px] font-black text-gray-600 uppercase tracking-[0.1em] mb-1">Total</p>
                                                        <p className="text-primary font-black text-[13px] tracking-tight">${booking.total_price}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center min-w-[140px] gap-2">
                                                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-md border border-white/5 h-fit">
                                                    {getStatusIcon(booking.status)}
                                                    <span className="text-[8px] font-black text-white uppercase tracking-[0.1em]">
                                                        {booking.status}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 mt-1">
                                                    {booking.payment_status === 'unpaid' && booking.status !== 'cancelled' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handlePayment(booking.id)}
                                                                disabled={paymentLoading === booking.id}
                                                                className="orange-gradient text-white px-5 py-2.5 rounded-md font-black text-[7px] uppercase tracking-[0.2em] shadow-orange hover:scale-105 active:scale-95 transition disabled:opacity-50"
                                                            >
                                                                {paymentLoading === booking.id ? '...' : 'Pay Now'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(booking.id)}
                                                                disabled={deleteLoading === booking.id}
                                                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-2.5 rounded-md font-black text-[7px] uppercase tracking-[0.2em] border border-red-500/20 transition hover:scale-105"
                                                                title="Cancel & Delete"
                                                            >
                                                                {deleteLoading === booking.id ? '...' : <Trash2 size={12} />}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-md border border-green-500/20">
                                                                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                                                                <span className="text-[7px] font-bold text-green-500 uppercase tracking-[0.1em]">Verified</span>
                                                            </div>
                                                            {booking.payment_status === 'paid' && (
                                                                <button
                                                                    onClick={() => handleDownloadInvoice(booking)}
                                                                    className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-3 py-2.5 rounded-md border border-white/10 transition flex items-center gap-2"
                                                                    title="Download Invoice"
                                                                >
                                                                    <Download size={12} className="text-primary" />
                                                                    <span className="text-[7px] font-black uppercase tracking-widest hidden md:inline">Invoice</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center text-white font-bold uppercase tracking-[0.5em]">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
