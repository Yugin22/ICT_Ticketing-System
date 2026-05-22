import React, { useEffect, useState } from 'react';
import { Bell, CircleDot } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface BellNotificationProps {
  /**
   * Optional admin user id. If omitted, component will fetch current user.
   */
  adminId?: string | null;
}

export const BellNotification: React.FC<BellNotificationProps> = ({ adminId: propAdminId }) => {
  const [adminId, setAdminId] = useState<string | null>(propAdminId ?? null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch current user if adminId not supplied
  useEffect(() => {
    if (adminId) return;
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setAdminId(data.user.id);
      }
    };
    fetchUser();
  }, [adminId]);

  // Subscribe to realtime channel for new messages directed to this admin
  useEffect(() => {
    if (!adminId) return;
    const channel = supabase
      .channel('public:admin-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as { admin_id: string; is_read: boolean };
        if (newMsg.admin_id === adminId && !newMsg.is_read) {
          setUnreadCount((c) => c + 1);
        }
      })
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [adminId]);

  // Reset count when user clicks the bell (assumes messages viewed elsewhere)
  const handleClick = () => {
    // Scroll to recent tickets section
    const el = document.getElementById('recent-tickets');
    el?.scrollIntoView({ behavior: 'smooth' });
    setUnreadCount(0);
  };

  // Trigger shake animation when count increases
  const [shake, setShake] = useState(false);
  useEffect(() => {
    if (unreadCount > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <button
      onClick={handleClick}
      className={`relative focus:outline-none ${shake ? 'animate-bell' : ''}`}
      aria-label="Admin notifications"
    >
      <Bell size={24} className="text-[#1a2744]" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 text-xs font-bold text-white justify-center items-center">
            {unreadCount}
          </span>
        </span>
      )}
    </button>
  );
};
