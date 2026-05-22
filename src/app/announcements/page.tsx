"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  Ticket,
  ArrowLeft,
  Megaphone,
  Clock,
  MessageSquare,
  Shield,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

type Announcement = {
  id: string;
  ticket_id: string;
  content: string;
  status: string;
  created_at: string;
  tickets: {
    title: string;
    id: string | number;
  };
};

export default function UserAnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [myTicketIds, setMyTicketIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    const initPage = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      // Fetch user's ticket IDs
      const { data: tickets } = await supabase
        .from("tickets")
        .select("id")
        .eq("user_id", data.user.id);
      
      const ticketIds = tickets ? tickets.map(t => String(t.id)) : [];
      setMyTicketIds(new Set(ticketIds));

      if (ticketIds.length > 0) {
        fetchAnnouncements(ticketIds);
      } else {
        setLoading(false);
      }
    };
    initPage();
  }, [router]);

  const fetchAnnouncements = async (ticketIds: string[]) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("announcements")
        .select(`
          id,
          ticket_id,
          content,
          status,
          created_at,
          tickets (title, id)
        `)
        .in("ticket_id", ticketIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data as any);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans pb-12 overflow-x-hidden">
      {/* HEADER */}
      <header className="bg-white px-4 sm:px-10 py-4 sm:py-5 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.02)] border-b border-[#e8ecf2] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0e12ffff]/10 flex items-center justify-center text-[#0e12ffff]">
            <Megaphone size={18} />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1a2744]">Latest Updates</span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-[#6b7fa3] hover:bg-[#f0f3f8] hover:text-[#1a2744]"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-fade-in-up">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1a2744]">Your Ticket Updates</h1>
          <p className="text-sm sm:text-base text-[#8c9bba] mt-2 font-medium">
            Stay informed with the latest updates and notices regarding your service requests.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-[#e8ecf2]" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-[#e8ecf2] flex flex-col items-center">
            <div className="w-20 h-20 bg-[#f8f9fc] rounded-[2.5rem] flex items-center justify-center mb-6">
              <Megaphone size={40} className="text-[#8c9bba] opacity-30" />
            </div>
            <h4 className="text-xl font-bold text-[#1a2744]">No updates yet</h4>
            <p className="text-sm text-[#8c9bba] mt-2 max-w-xs">Your personal ticket updates will be listed here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {announcements.map((ann) => {
              const status = ann.status || "Update";
              const note = ann.content;

              return (
                <Link 
                  href={`/tickets/${ann.ticket_id}`}
                  key={ann.id} 
                  className="block p-4 sm:p-5 rounded-2xl bg-white border border-[#e8ecf2] hover:border-indigo-300 hover:shadow-md transition-all duration-300 flex flex-col gap-3 relative group"
                >
                  {/* Status accent indicator ribbon on the left */}
                  <div className={`absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full ${
                    status === "Resolved" ? "bg-emerald-500" :
                    status === "On Hold" ? "bg-amber-500" :
                    status === "Open" ? "bg-red-500" :
                    "bg-blue-500"
                  }`} />

                  <div className="flex items-center justify-between pl-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] font-bold text-[#8c9bba] uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 flex-shrink-0">
                        ID-{ann.ticket_id}
                      </span>
                      <h4 className="text-sm font-bold text-[#1a2744] truncate group-hover:text-indigo-600 transition-colors" title={ann.tickets?.title}>
                        {ann.tickets?.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                        status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        status === "On Hold" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                        status === "Open" ? "bg-red-50 text-red-700 border border-red-100" :
                        "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}>
                        {status}
                      </span>
                      <span className="text-[10px] text-[#8c9bba] font-bold tracking-tighter uppercase whitespace-nowrap hidden sm:inline-block">
                        {new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pl-3">
                    <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                      "{note}"
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
